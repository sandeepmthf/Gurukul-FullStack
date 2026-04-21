import dotenv from "dotenv";
dotenv.config();

import transporter from "./config/nodeMailer.js";

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ NodeMailer is NOT working. Error:");
    console.log(error.message);
  } else {
    console.log("✅ NodeMailer IS working! Server is ready to take our messages");
  }
  process.exit();
});
