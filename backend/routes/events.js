const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { protect, restrictTo } = require("../middleware/auth");
const mongoose = require("mongoose");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("category", "name");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Search events
router.get("/search", async (req, res) => {
  try {
    const { name, location, category } = req.query;
    console.log("Search query parameters:", { name, location, category });
    
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (category) {
      try {
        // Validate if the category ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(category)) {
          console.log("Invalid category ID format:", category);
          return res.status(400).json({ 
            message: "Invalid category ID format",
            category: category 
          });
        }
        query.category = new mongoose.Types.ObjectId(category);
      } catch (err) {
        console.error("Error processing category ID:", err);
        return res.status(400).json({ 
          message: "Error processing category ID",
          error: err.message 
        });
      }
    }

    console.log("MongoDB query:", JSON.stringify(query, null, 2));
    
    // First check if the category exists
    if (category) {
      const categoryExists = await mongoose.model('EventCategory').findById(category);
      if (!categoryExists) {
        console.log("Category not found:", category);
        return res.status(404).json({ 
          message: "Category not found",
          category: category 
        });
      }
    }
    
    const events = await Event.find(query)
      .populate("category", "name")
      .lean()
      .exec();
    
    console.log(`Found ${events.length} events for query:`, query);
    res.json(events);
  } catch (err) {
    console.error("Search error details:", {
      message: err.message,
      stack: err.stack,
      query: req.query
    });
    res.status(500).json({ 
      message: "Server error during search",
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Get single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new event (Admin only)
router.post("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      date,
      price,
      imageUrl,
      category,
      availableTickets,
      features,
      organizer,
      contactEmail,
      benefits,
      targetAudience,
      expectations,
    } = req.body;

    const newEvent = new Event({
      name,
      description,
      location,
      date,
      price,
      imageUrl,
      category,
      availableTickets,
      features,
      organizer,
      contactEmail,
      benefits,
      targetAudience,
      expectations,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event (Admin only)
router.put("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      date,
      price,
      imageUrl,
      category,
      availableTickets,
      features,
      organizer,
      contactEmail,
      benefits,
      targetAudience,
      expectations,
    } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        location,
        date,
        price,
        imageUrl,
        category,
        availableTickets,
        features,
        organizer,
        contactEmail,
        benefits,
        targetAudience,
        expectations,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event (Admin only)
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 