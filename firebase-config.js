import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQ9BsxmFN-sdhPPTSnoqyYRb8Y4qSDC9s",
  authDomain: "sunu-habitat.firebaseapp.com",
  projectId: "sunu-habitat",
  storageBucket: "sunu-habitat.firebasestorage.app",
  messagingSenderId: "511373127898",
  appId: "1:511373127898:web:24c45379b1cca1031e35e3",
  measurementId: "G-ZXJV145FVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export for use in other parts of the application
export { app, analytics };
