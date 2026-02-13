const express = require("express");
const router = express.Router();
const EventCategory = require("../models/EventCategory");
const { protect, restrictTo } = require("../middleware/auth");

// Get all event categories
router.get("/", async (req, res) => {
  try {
    console.log("Attempting to fetch all event categories...");
    const categories = await EventCategory.find();
    console.log(`Found ${categories.length} categories.`);
    res.json(categories);
  } catch (err) {
    console.error("Error fetching event categories:", err);
    res.status(500).json({ message: "Server error fetching categories", error: err.message });
  }
});

// Get single event category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await EventCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Event category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new event category (Admin only)
router.post("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    const newCategory = new EventCategory({ name, description, imageUrl });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event category (Admin only)
router.put("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    const updatedCategory = await EventCategory.findByIdAndUpdate(
      req.params.id,
      { name, description, imageUrl },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Event category not found" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event category (Admin only)
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const deletedCategory = await EventCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCategory) {
      return res.status(404).json({ message: "Event category not found" });
    }
    res.json({ message: "Event category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 