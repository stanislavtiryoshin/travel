const express = require("express");
const path = require("path");
const router = express.Router();
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const nodemailer = require("nodemailer");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/send-phone-email", (req, res) => {
  const { phone } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "stanislav.tiryoshin@gmail.com",
      pass: "nauqkkwdtqnmuxeo",
    },
  });

  // var sendPwdReminder = transporter.templateSender(
  //   {
  //     subject: "Заявка на консультацию",
  //     text: `Поступила новая заявка на консультацию. Телефон: ${phone}`,
  //     html: `Поступила новая заявка на консультацию. Телефон: <a href="${phone}">${phone}</a>`,
  //   },
  //   {
  //     from: "stanislav.tiryoshin@gmail.com",
  //   }
  // );

  // sendPwdReminder(
  //   {
  //     to,
  //   },
  //   function (err, info) {
  //     if (err) {
  //       console.log("Error");
  //     } else {
  //       console.log("Password reminder sent");
  //     }
  //   }
  // );

  const mailOptions = {
    from: "stanislav.tiryoshin@gmail.com",
    to: "stanislav.tiryoshin@gmail.com",
    subject: "Заявка на консультацию",
    text: `Поступила новая заявка на консультацию. Телефон: ${phone}`,
    html: `Поступила новая заявка на консультацию. Телефон: <a href="tel:${phone}">${phone}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully");
    }
  });
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/hotels", require("./routes/hotelRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/excursions", require("./routes/excursionRoutes"));
app.use("/api/locations", require("./routes/locationRoutes"));

// Serve frontend
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, "../", "frontend", "build", "index.html")
//     )
//   );
// } else {
//   app.get("/", (req, res) => res.send("Please set to production"));
// }

app.use(errorHandler);

app.listen(port, () => console.log(`Port ${port} is up and running baby`));
