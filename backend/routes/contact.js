const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect, admin } = require("../middleware/auth");

// Submit contact form
router.post("/", async (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      console.log('Missing required fields:', { name, email, subject, message });
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    console.log('Saving contact message to database...');
    await contact.save();
    console.log('Contact message saved successfully:', contact);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
});

// Get all contact messages (admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single contact message (admin only)
router.get("/:id", protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update contact message status (admin only)
router.patch("/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    contact.status = status;
    await contact.save();

    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete contact message (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    await contact.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 