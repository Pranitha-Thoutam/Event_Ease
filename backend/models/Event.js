const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "/images/events/placeholder.jpg",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventCategory",
      required: true,
    },
    eventType: {
      type: String,
      enum: ["ticket", "planning"],
      required: true,
      default: "ticket"
    },
    // Fields for ticket-based events
    availableTickets: {
      type: Number,
      min: 0,
      // Only required for ticket-based events
      required: function() {
        return this.eventType === "ticket";
      }
    },
    // Fields for planning services
    planningDetails: {
      guestCount: {
        type: Number,
        min: 0,
        // Only required for planning services
        required: function() {
          return this.eventType === "planning";
        }
      },
      duration: {
        type: String,
        // Only required for planning services
        required: function() {
          return this.eventType === "planning";
        }
      },
      services: [{
        type: String
      }],
      inclusions: [{
        type: String
      }],
      customizations: [{
        type: String
      }]
    },
    features: [
      {
        type: String,
      },
    ],
    organizer: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    benefits: [
      {
        type: String,
      },
    ],
    targetAudience: {
      type: String,
    },
    expectations: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema); 