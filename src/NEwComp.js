import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';



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
