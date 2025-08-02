const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Task = require("../models/task");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTaskReminder = async (user, task) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Task Reminder: ${task.name}`,
      text: `Your task "${task.name}" is overdue. Due date was ${
        task.dueDate.toISOString().split("T")[0]
      }.`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const checkOverdueTasks = async () => {
  try {
    const today = new Date();
    const tasks = await Task.find({
      dueDate: { $lt: today },
      completed: false,
      notifications: true,
    }).populate({
      path: "phaseId",
      populate: {
        path: "projectId",
        populate: { path: "userId" },
      },
    });

    for (const task of tasks) {
      const user = task.phaseId.projectId.userId;
      if (user.preferences.notifications) {
        await sendTaskReminder(user, task);
      }
    }
  } catch (error) {
    console.error("Error checking overdue tasks:", error);
  }
};

// Schedule daily check at midnight
cron.schedule("0 0 * * *", checkOverdueTasks);

module.exports = { sendTaskReminder };
