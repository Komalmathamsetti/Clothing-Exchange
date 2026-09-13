const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.registerUser = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, city, state } = req.body;
    if (
      !full_name ||
      !email ||
      !password ||
      !phone ||
      !role ||
      !city ||
      !state
    ) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields required",
      });
    }
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email= $1`,
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO users
        (full_name,email,password,role,phone,city,state)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id,full_name,email,role,phone,city,state`,
      [full_name, email, hashedPassword, role, phone, city, state],
    );
    res.status(201).json({
      success: true,
      message: "User Registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Find user
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentUser = user.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, currentUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Check whether account is suspended
    if (!currentUser.is_active) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been suspended. Please contact the administrator.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: currentUser.id,
        role: currentUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,

      message: "Login Successful",

      token,

      user: {
        id: currentUser.id,
        full_name: currentUser.full_name,
        email: currentUser.email,
        role: currentUser.role,
        phone: currentUser.phone,
        is_active: currentUser.is_active,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).send("Google credential is required");
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).send("Invalid Google token");
    }

    const { sub: googleId, email, email_verified, name, picture } = payload;

    if (!email || !email_verified) {
      return res.status(401).send("Google email is not verified");
    }

    let user;

    // 1. Check whether Google account already exists
    let result = await pool.query(`SELECT * FROM users WHERE google_id = $1`, [
      googleId,
    ]);

    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      // 2. Check whether an account already exists with this email
      result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);

      if (result.rows.length > 0) {
        // Existing account → link Google
        user = result.rows[0];

        await pool.query(
          `
          UPDATE users
          SET
            google_id = $1,
            auth_provider = 'google',
            profile_image = COALESCE(profile_image, $2),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $3
          `,
          [googleId, picture || null, user.id],
        );

        user.google_id = googleId;
        user.auth_provider = "google";

        if (!user.profile_image && picture) {
          user.profile_image = picture;
        }
      } else {
        // 3. Create new Google user
        const newUser = await pool.query(
          `
          INSERT INTO users
          (
            full_name,
            email,
            password,
            role,
            profile_image,
            google_id,
            auth_provider
          )
          VALUES
          ($1, $2, NULL, 'USER', $3, $4, 'google')
          RETURNING *
          `,
          [name || "Google User", email, picture || null, googleId],
        );

        user = newUser.rows[0];
      }
    }

    // Account suspension check
    if (!user.is_active) {
      return res
        .status(403)
        .send(
          "Your account has been suspended. Please contact the administrator.",
        );
    }

    // Generate ClothSwap JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Redirect back to React
    const redirectUrl = `http://localhost:5173/google-success?token=${encodeURIComponent(token)}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return res.redirect("http://localhost:5173/login?google_error=1");
  }
};
