require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await pool.connect();
        console.log("Database Connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server Running On Port ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
}
startServer();