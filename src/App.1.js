import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { handleLogout, Register } from "./App";

export function App() {
    const [user, setUser] = useState(null);

    // Check if the user is already authenticated
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Fetch user profile using the token
            axios.get("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user profile:", error);
                });
        }
    }, []);

    return (
        <div>
            <Router>
                <nav>
                    {user ? (
                        <div>
                            <p>Welcome, {user.username}!</p>
                            <Link to="/profile">Profile</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/register">Register</Link>
                            <Link to="/login">Login</Link>
                        </div>
                    )}
                </nav>
                <Routes>
                    <Route component={Register} path="/register">
                        <Register />
                    </Route>
                    {/* <Route path="/login">
              <Login />
            </Route>
            <Route path="/profile">
              <Profile user={user} />
            </Route> */}
                </Routes>
            </Router>
        </div>
    );
}
