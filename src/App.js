import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import CoinDetails from './CoinDetails'; // Import the CoinDetails component
import WeatherData from './Wather';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:8000/api/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('token');
        });
    }
  }, []);

  return (
    <div className="app-container">
      <ToastContainer />
      <Router>
        <nav className="navbar">
          {user ? (
            <div>
              <p className="welcome-message">Welcome, {user.username}!</p>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <Link to="/coin-details" className="nav-link"> {/* New link for Coin Details */}
                Coin Details
              </Link>
              <Link to="/weather" className="nav-link"> {/* New link for Coin Details */}
                Weather
              </Link>
              <button onClick={handleLogout} className="nav-link">
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </div>
          )}
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/coin-details" element={!user ? <Navigate to="/login" /> : <CoinDetails />} />
          <Route path="/weather" element={!user ? <Navigate to="/login" /> : <WeatherData />} />

        </Routes>
      </Router>
    </div>
  );
}

function Register() {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to the registration endpoint
    axios
      .post("/api/register", formData)
      .then((response) => {
        console.log("Registration successful:", response.data);
        // You can add logic to redirect the user to the login page
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function Login() {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a POST request to the login endpoint
    axios
      .post("http://localhost:8000/api/login", formData)
      .then((response) => {
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.access_token);
        // You can add logic to redirect the user to their profile or another page
        window.location.reload()
      })
      .catch((error) => {
        console.log("Login failed:", error);
        toast.error('An error occurred : ' + error.response.data.detail, {
          position: "top-right",
          autoClose: 5000, // Optional: Close after 5 seconds
        });
      });
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Profile({ user }) {
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <Link to="/edit-profile" className="nav-link">
        Edit Profile
      </Link>
    </div>
  );
}

function handleLogout() {
  // Remove the token from local storage
  localStorage.removeItem("token");
  // You can add logic to redirect the user to the login or home page
}

export default App;
