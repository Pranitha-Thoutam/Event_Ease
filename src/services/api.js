import axios from "axios";

const API_URL = "http://localhost:5001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
  updateProfile: async (userData) => {
    try {
      console.log('Updating profile with data:', userData);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.put("/auth/profile", userData);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error.response || error);
      throw error;
    }
  },
  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reset link');
    }
    return await response.json();
  },
  resetPassword: async (token, password) => {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }
    return await response.json();
  },
};

// Contact services
export const contactService = {
  submitContact: async (contactData) => {
    const response = await api.post("/contact", contactData);
    return response.data;
  },
  
  getAllContacts: async () => {
    const response = await api.get("/contact");
    return response.data;
  },

  getContact: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  updateContactStatus: async (id, status) => {
    const response = await api.patch(`/contact/${id}`, { status });
    return response.data;
  },

  deleteContact: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  }
};

// EventCategory services
export const eventCategoryService = {
  getAll: async () => {
    const response = await api.get("/eventCategories");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/eventCategories/${id}`);
    return response.data;
  },
  create: async (eventCategoryData) => {
    const response = await api.post("/eventCategories", eventCategoryData);
    return response.data;
  },
  update: async (id, eventCategoryData) => {
    const response = await api.put(`/eventCategories/${id}`, eventCategoryData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/eventCategories/${id}`);
    return response.data;
  },
};

// Event services
export const eventService = {
  getAll: async () => {
    const response = await api.get("/events");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  search: async (searchParams) => {
    const response = await api.get("/events/search", { params: searchParams });
    return response.data;
  },
  create: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  addReview: async (id, reviewData) => {
    const response = await api.post(`/events/${id}/reviews`, reviewData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// EventBooking services
export const eventBookingService = {
  getAll: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  create: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
