import mongoose from "mongoose";

const addCalendarCountToUsers = async () => {
  const User = require("../models/user").default;
  await User.updateMany(
    { calendarCount: { $exists: false } },
    { $set: { calendarCount: 0 } }
  );
  console.log("Migration complete: calendarCount initialized to 0 for all users.");
};

addCalendarCountToUsers()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error("Migration error:", err);
    mongoose.connection.close();
  });
