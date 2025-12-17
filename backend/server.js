const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notes", noteRoutes);




mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected "))
  .catch((err) => console.error("Mongo error ", err));

// test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const protect = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user,
  });
});


