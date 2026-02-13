const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");
const EventCategory = require("./models/EventCategory");
const User = require("./models/User");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample Event Categories
const eventCategories = [
  {
    name: "Birthday Celebrations",
    description: "Make your birthday special with our celebration packages.",
    imageUrl: "/images/categories/birthday.jpg",
  },
  {
    name: "Corporate Events",
    description: "Professional events for businesses and organizations.",
    imageUrl: "/images/categories/corporate.jpg",
  },
  {
    name: "Weddings",
    description: "Your perfect day deserves perfect planning.",
    imageUrl: "/images/categories/wedding.jpg",
  },
  {
    name: "Social Gatherings",
    description: "From casual meetups to grand celebrations.",
    imageUrl: "/images/categories/social.jpg",
  },
  {
    name: "Cultural Events",
    description: "Celebrate traditions and cultural heritage.",
    imageUrl: "/images/categories/cultural.jpg",
  },
  {
    name: "Workshops & Seminars",
    description: "Hands-on learning and interactive sessions.",
    imageUrl: "/images/categories/workshops.jpg",
  },
  {
    name: "Sports & Fitness",
    description: "Active events for all fitness levels.",
    imageUrl: "/images/categories/sports.jpg",
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Event.deleteMany({});
    await EventCategory.deleteMany({});
    await User.deleteMany({ role: { $ne: "admin" } }); // Keep admin users

    // Insert new Event Categories
    const createdCategories = await EventCategory.insertMany(eventCategories);
    console.log("Event categories seeded!");

    // Get the IDs of the created categories
    const birthdayCategory = createdCategories.find(
      (cat) => cat.name === "Birthday Celebrations"
    );
    const corporateCategory = createdCategories.find(
      (cat) => cat.name === "Corporate Events"
    );
    const weddingCategory = createdCategories.find(
      (cat) => cat.name === "Weddings"
    );
    const socialCategory = createdCategories.find(
      (cat) => cat.name === "Social Gatherings"
    );
    const culturalCategory = createdCategories.find(
      (cat) => cat.name === "Cultural Events"
    );
    const workshopSeminarCategory = createdCategories.find(
      (cat) => cat.name === "Workshops & Seminars"
    );
    const sportsFitnessCategory = createdCategories.find(
      (cat) => cat.name === "Sports & Fitness"
    );

    // Sample Events data (using created category IDs)
    const events = [
      {
        name: "Kids Fun Birthday Bash",
        description: "An exciting birthday party with clowns, magic, and games for kids.",
        location: "Kids Play Zone, Downtown",
        date: new Date("2024-07-20T14:00:00Z"),
        price: 12000,
        imageUrl: "/images/events/kids_birthday.jpg",
        category: birthdayCategory._id,
        availableTickets: 30,
        features: ["Clown show", "Magic tricks", "Face painting", "Balloon animals"],
        organizer: "Joyful Events Co.",
        contactEmail: "joyful@events.com",
        benefits: ["Unforgettable memories for kids", "Hassle-free planning"],
        targetAudience: "Parents with children aged 4-10",
        expectations: "Lots of laughter and excitement!",
      },
      {
        name: "Elegant Adult Birthday Dinner",
        description: "Sophisticated dinner party package for adult birthdays with gourmet catering.",
        location: "The Grand Ballroom, Uptown",
        date: new Date("2024-08-10T19:00:00Z"),
        price: 35000,
        imageUrl: "/images/events/adult_birthday.jpg",
        category: birthdayCategory._id,
        availableTickets: 50,
        features: ["Gourmet dinner", "Live jazz band", "Personalized decor"],
        organizer: "Elite Celebrations",
        contactEmail: "elite@celebrations.com",
        benefits: ["Luxurious dining experience", "Relaxed and elegant atmosphere"],
        targetAudience: "Adults seeking a refined birthday celebration",
        expectations: "Dress code: formal.",
      },
      {
        name: "Annual Tech Summit 2024",
        description: "Leading conference on AI, ML, and Blockchain with industry pioneers.",
        location: "Convention Center, Tech Hub",
        date: new Date("2024-09-05T09:00:00Z"),
        price: 25000,
        imageUrl: "/images/events/tech_summit.jpg",
        category: corporateCategory._id,
        availableTickets: 200,
        features: ["Keynote speeches", "Breakout sessions", "Exhibition hall", "Networking lounge"],
        organizer: "Global Innovations",
        contactEmail: "info@techsummit.com",
        benefits: ["Gain industry insights", "Network with peers and experts", "Discover new technologies"],
        targetAudience: "Tech professionals, developers, entrepreneurs",
        expectations: "Be prepared for in-depth discussions.",
      },
      {
        name: "Product Launch Event",
        description: "Showcase your new product to a selected audience with a grand launch party.",
        location: "City Exhibition Dome",
        date: new Date("2024-10-15T17:00:00Z"),
        price: 50000,
        imageUrl: "/images/events/product_launch.jpg",
        category: corporateCategory._id,
        availableTickets: 100,
        features: ["Product demonstration", "Media coverage", "Networking reception", "Live Q&A"],
        organizer: "Launch Masters",
        contactEmail: "launch@masters.com",
        benefits: ["Generate buzz for your product", "Attract potential investors"],
        targetAudience: "Journalists, investors, industry leaders",
        expectations: "Professional and high-impact presentation.",
      },
      {
        name: "Grand Indian Wedding Ceremony",
        description: "Traditional Indian wedding package including rituals, catering, and elaborate decor.",
        location: "Heritage Palace, Countryside",
        date: new Date("2024-11-25T11:00:00Z"),
        price: 800000,
        imageUrl: "/images/events/indian_wedding.jpg",
        category: weddingCategory._id,
        availableTickets: 300,
        features: ["Multi-day ceremonies", "Customized decor", "Traditional music and dance", "Gourmet Indian cuisine"],
        organizer: "Cultural Weddings",
        contactEmail: "indian@weddings.com",
        benefits: ["Authentic cultural experience", "Stress-free planning of complex rituals"],
        targetAudience: "Couples seeking traditional Indian weddings",
        expectations: "Rich cultural experience and grand celebration.",
      },
      {
        name: "Beach Wedding Extravaganza",
        description: "Dreamy beach wedding with stunning ocean views and bespoke arrangements.",
        location: "Paradise Beach Resort",
        date: new Date("2025-01-10T16:00:00Z"),
        price: 600000,
        imageUrl: "/images/events/beach_wedding.jpg",
        category: weddingCategory._id,
        availableTickets: 150,
        features: ["Beachfront ceremony", "Sunset reception", "Seafood buffet", "Live band"],
        organizer: "Oceanic Weddings",
        contactEmail: "beach@weddings.com",
        benefits: ["Picturesque setting", "Unique and memorable experience"],
        targetAudience: "Couples desiring a destination wedding",
        expectations: "Relaxed and romantic atmosphere.",
      },
      {
        name: "Community Potluck & Games Day",
        description: "A casual gathering for neighbors to share food and play outdoor games.",
        location: "Local Community Park",
        date: new Date("2024-07-28T11:00:00Z"),
        price: 0,
        imageUrl: "/images/events/potluck.jpg",
        category: socialCategory._id,
        availableTickets: 100,
        features: ["Bring your own dish", "Board games", "Sports activities"],
        organizer: "Neighborhood Watch",
        contactEmail: "community@events.com",
        benefits: ["Meet neighbors", "Strengthen community bonds", "Free event"],
        targetAudience: "Local residents and families",
        expectations: "Casual and friendly interaction.",
      },
      {
        name: "Annual Charity Ball",
        description: "A formal evening to raise funds for a noble cause with dinner and entertainment.",
        location: "City Grand Hall",
        date: new Date("2024-12-01T19:00:00Z"),
        price: 5000,
        imageUrl: "/images/events/charity_ball.jpg",
        category: socialCategory._id,
        availableTickets: 200,
        features: ["Black-tie event", "Gourmet dinner", "Silent auction", "Guest speakers"],
        organizer: "Hope Foundation",
        contactEmail: "ball@hopefoundation.com",
        benefits: ["Contribute to a cause", "Elegant social experience"],
        targetAudience: "Philanthropists, supporters of charity",
        expectations: "Formal evening with fundraising.",
      },
      {
        name: "Global Cultural Festival",
        description: "Celebrate diversity with music, dance, food, and crafts from around the world.",
        location: "Fairgrounds, City Outskirts",
        date: new Date("2024-10-20T10:00:00Z"),
        price: 200,
        imageUrl: "/images/events/cultural_festival.jpg",
        category: culturalCategory._id,
        availableTickets: 2000,
        features: ["International food stalls", "Live performances", "Artisan market", "Kids zone"],
        organizer: "Unity Cultural Org.",
        contactEmail: "festival@unity.com",
        benefits: ["Experience global cultures", "Family-friendly entertainment"],
        targetAudience: "Families, culture enthusiasts",
        expectations: "Vibrant and bustling atmosphere.",
      },
      {
        name: "Ancient Civilizations Exhibition",
        description: "Explore artifacts and history from ancient Egypt, Rome, and Greece.",
        location: "National Museum, Capital City",
        date: new Date("2024-09-15T09:00:00Z"),
        price: 300,
        imageUrl: "/images/events/ancient_exhibition.jpg",
        category: culturalCategory._id,
        availableTickets: 500,
        features: ["Rare artifacts", "Interactive displays", "Guided tours", "Documentaries"],
        organizer: "Historical Society",
        contactEmail: "history@museum.com",
        benefits: ["Educational experience", "Insight into human history"],
        targetAudience: "History enthusiasts, students",
        expectations: "Quiet and informative environment.",
      },
      {
        name: "Advanced React Workshop",
        description: "Deep dive into React hooks, context API, and performance optimization.",
        location: "Online",
        date: new Date("2024-08-01T09:00:00Z"),
        price: 800,
        imageUrl: "/images/events/react_workshop.jpg",
        category: workshopSeminarCategory._id,
        availableTickets: 50,
        features: ["Live coding sessions", "Q&A with experts", "Project-based learning"],
        organizer: "Code Masters Academy",
        contactEmail: "learn@codemasters.com",
        benefits: ["Enhance React skills", "Build complex applications"],
        targetAudience: "Frontend developers, aspiring React developers",
        expectations: "Prior React knowledge required.",
      },
      {
        name: "Leadership & Management Seminar",
        description: "Develop essential leadership and management skills for career growth.",
        location: "Executive Training Center",
        date: new Date("2024-08-25T10:00:00Z"),
        price: 1500,
        imageUrl: "/images/events/leadership_seminar.jpg",
        category: workshopSeminarCategory._id,
        availableTickets: 100,
        features: ["Interactive discussions", "Case studies", "Personalized feedback"],
        organizer: "Success Builders",
        contactEmail: "info@successbuilders.com",
        benefits: ["Boost leadership capabilities", "Improve team performance"],
        targetAudience: "Managers, team leads, aspiring leaders",
        expectations: "Engaging and practical learning.",
      },
      {
        name: "City Marathon 2024",
        description: "Annual marathon event attracting runners from around the globe.",
        location: "City Streets, Starting at Central Plaza",
        date: new Date("2024-11-03T06:00:00Z"),
        price: 100,
        imageUrl: "/images/events/city_marathon.jpg",
        category: sportsFitnessCategory._id,
        availableTickets: 5000,
        features: ["Full marathon", "Half marathon", "10K run", "Hydration stations"],
        organizer: "City Runners Club",
        contactEmail: "marathon@cityrunners.com",
        benefits: ["Achieve fitness goals", "Support local charities", "Enjoy scenic route"],
        targetAudience: "Runners, fitness enthusiasts",
        expectations: "Early start, challenging but rewarding.",
      },
      {
        name: "Yoga & Wellness Retreat",
        description: "A peaceful retreat to rejuvenate mind, body, and soul through yoga and meditation.",
        location: "Mountain View Retreat Center",
        date: new Date("2024-09-20T09:00:00Z"),
        price: 5000,
        imageUrl: "/images/events/yoga_retreat.jpg",
        category: sportsFitnessCategory._id,
        availableTickets: 20,
        features: ["Daily yoga sessions", "Meditation classes", "Healthy meals", "Nature walks"],
        organizer: "Inner Peace Studio",
        contactEmail: "retreat@innerpeace.com",
        benefits: ["Reduce stress", "Improve flexibility", "Achieve inner peace"],
        targetAudience: "Yoga practitioners, individuals seeking relaxation",
        expectations: "Quiet and serene environment.",
      },
    ];

    await Event.insertMany(events);
    console.log("Events seeded!");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
