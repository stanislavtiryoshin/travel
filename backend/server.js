const express = require("express");
const cors = require("cors");
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
const { parse } = require("csv-parse");
const fs = require("fs");

connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// New consult request email to administrator
app.post("/api/send-phone-email", (req, res) => {
  const { phone } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "stanislav.tiryoshin@gmail.com",
      pass: "nauqkkwdtqnmuxeo",
    },
  });

  const mailOptions = {
    from: "stanislav.tiryoshin@gmail.com",
    to: "stanislav.tiryoshin@gmail.com",
    subject: "Заявка на консультацию",
    text: `Поступила новая заявка на консультацию. Телефон: ${phone}`,
    html: `Поступила новая заявка на консультацию. <br> <div> Телефон: <a style='text-decoration:none;width:fit-content;display:flex;align-items:center;justify-content:center;background-color:rgba(94, 178, 21, 1);padding:10px;border-radius:5px;color:#fff' href="tel:${phone}">${phone}</a> </div>`,
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

// New order email to administrator
app.post("/api/send-order-email", (req, res) => {
  const { name, email, phone, hotel, rooms, sum, startDate, endDate } =
    req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "stanislav.tiryoshin@gmail.com",
      pass: "nauqkkwdtqnmuxeo",
    },
  });

  const mailOptions = {
    from: "stanislav.tiryoshin@gmail.com",
    to: "stanislav.tiryoshin@gmail.com",
    subject: "Новый заказ",
    // text: `Поступил новый заказ. Телефон: ${phone}, email: ${email}, имя: ${name}, hotel: ${hotel}, room: ${room.roomName}, sum: ${sum}, startDate: ${startDate}, endDate: ${endDate}`,
    html: `Поступил новый заказ. <br> <div> Телефон: <a href="tel:${phone}">${phone}</a>, <br> email: <a href="mailto:${email}">${email}</a>, <br> имя: ${name}, <br> hotel: ${hotel}, <br> room: , <br> sum: ${sum}, <br> startDate: ${new Date(
      +startDate
    ).toLocaleDateString()}, <br> endDate: ${new Date(
      +endDate
    ).toLocaleDateString()} </div>`,
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

// Confirmation email to client
app.post("/api/send-client-email", (req, res) => {
  const { name, email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "stanislav.tiryoshin@gmail.com",
      pass: "nauqkkwdtqnmuxeo",
    },
  });

  const mailOptions = {
    from: "stanislav.tiryoshin@gmail.com",
    to: email,
    subject: "Ваша заявка получена",
    // text: `Поступил новый заказ. Телефон: ${phone}, email: ${email}, имя: ${name}, hotel: ${hotel}, room: ${room.roomName}, sum: ${sum}, startDate: ${startDate}, endDate: ${endDate}`,
    html: `${name}, Ваша заявка получена администратором. С Вами свяжутся в ближайшее время.`,
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

/* ROUTES */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/hotels", require("./routes/hotelRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/excursions", require("./routes/excursionRoutes"));
app.use("/api/locations", require("./routes/locationRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/hotelServices", require("./routes/hotelServiceRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));

app.use("/api/programs", require("./routes/programRoutes"));
app.use("/api/sanatoriums", require("./routes/sanatoryRoutes"));
app.use("/api/camps", require("./routes/campRoutes"));
app.use("/api/tour", require("./routes/tourRoutes"));

app.use("/images", express.static(path.join(__dirname, "../public/uploads")));

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
