const express = require("express");
const Note = require("../models/note");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


router.post(
  "/upload",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, subject, course, description, isPublic } = req.body;


      if (!req.file) {
        return res.status(400).json({ message: "File required" });
      }

      const note = await Note.create({
        title,
        subject,
        course,
        description,
        fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
        uploadedBy: req.user,
        isPublic: isPublic !== "false"
      });

      res.status(201).json({
        message: "Note uploaded successfully",
        note,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const notes = await Note.find({
      $and: [
        {
          $or: [
            { isPublic: true },
            { uploadedBy: req.user?.id }
          ]
        },
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { subject: { $regex: search, $options: "i" } },
            { course: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        }
      ]
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
