const pool = require("../config/db");

const createNotification = async ({
  userId,
  type,
  title,
  message,
  referenceId = null,
  referenceType = null,
}) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO notifications
      (
        user_id,
        type,
        title,
        message,
        reference_id,
        reference_type
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        userId,
        type,
        title,
        message,
        referenceId,
        referenceType,
      ]
    );

    const notification = result.rows[0];

    // Send real-time notification
    const io = global.io;

    if (io) {
      io.to(`user_${userId}`).emit(
        "new_notification",
        notification
      );
    }

    return notification;

  } catch (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    return null;
  }
};


// -----------------------------------------------------
// Notify multiple users
// -----------------------------------------------------

const notifyUsers = async ({
  userIds,
  type,
  title,
  message,
  referenceId = null,
  referenceType = null,
}) => {
  for (const userId of userIds) {
    await createNotification({
      userId,
      type,
      title,
      message,
      referenceId,
      referenceType,
    });
  }
};


// -----------------------------------------------------
// Notify all active users except one
// -----------------------------------------------------

const notifyAllActiveUsersExcept = async ({
  excludeUserId,
  type,
  title,
  message,
  referenceId = null,
  referenceType = null,
}) => {
  try {
    const result = await pool.query(
      `
      SELECT id
      FROM users
      WHERE is_active = true
      AND id <> $1
      `,
      [excludeUserId]
    );

    const userIds = result.rows.map(
      (user) => user.id
    );

    await notifyUsers({
      userIds,
      type,
      title,
      message,
      referenceId,
      referenceType,
    });

  } catch (error) {
    console.error(
      "NOTIFY ACTIVE USERS ERROR:",
      error
    );
  }
};


// -----------------------------------------------------
// Notify all active admins
// -----------------------------------------------------

const notifyAdmins = async ({
  type,
  title,
  message,
  referenceId = null,
  referenceType = null,
}) => {
  try {
    const result = await pool.query(
      `
      SELECT id
      FROM users
      WHERE role = 'ADMIN'
      AND is_active = true
      `
    );

    const adminIds = result.rows.map(
      (admin) => admin.id
    );

    await notifyUsers({
      userIds: adminIds,
      type,
      title,
      message,
      referenceId,
      referenceType,
    });

  } catch (error) {
    console.error(
      "NOTIFY ADMINS ERROR:",
      error
    );
  }
};


module.exports = {
  createNotification,
  notifyUsers,
  notifyAllActiveUsersExcept,
  notifyAdmins,
};