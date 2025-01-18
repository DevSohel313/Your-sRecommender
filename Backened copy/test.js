const sendResetEmail = require("./utils/emailHelper");

const testEmail = async () => {
  const email = "recipient@example.com"; // Replace with your test email
  const resetLink = "http://localhost:5000/reset-password/test-token"; // Replace with a mock reset link

  try {
    const result = await sendResetEmail(email, resetLink);
    console.log("Email sent successfully:", result);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};

testEmail();
