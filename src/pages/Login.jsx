import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    // Clear existing tokens when the login page loads
    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        // Optional: Reset body styles to ensure full-page background works
        document.body.style.margin = "0"; 
        document.body.style.padding = "0";
        document.body.style.boxSizing = "border-box";

        return () => {
            document.body.style.margin = "";
            document.body.style.padding = "";
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // 1. Call the API directly (avoiding interceptor issues for login)
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                username, 
                password
            });

            console.log("Login Response:", response.data); 

            // 2. Extract Token and Role
            const { token, role } = response.data;

            if (!token) {
                throw new Error("Token missing in server response");
            }

            // 3. Store in LocalStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // 4. Redirect based on Role
            if (role === 'ROLE_CUSTOMER' || role === 'CUSTOMER') {
                navigate('/my-account'); // Redirect to Customer Dashboard
            } 
            else if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
                navigate('/dashboard');  
            } 
            else {
                // Fallback for unexpected roles
                console.warn("Unknown role:", role);
                navigate('/dashboard');
            }

        } catch (err) {
            console.error("Login Error:", err);
            // Handle different error structures (axios error vs generic error)
            const errorMessage = err.response?.data?.message || err.message || "Login failed. Please check credentials.";
            setError(errorMessage);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.loginCard}>
                <h2 style={styles.heading}>Dunning System Login</h2>
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={isHovered ? {...styles.button, ...styles.buttonHover} : styles.button}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Login
                    </button>
                </form>
                
                {error && <div style={styles.errorMessage}>{error}</div>}
            </div>
        </div>
    );
};

const styles = {
    // 1. FULL PAGE CONTAINER
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f4f7f6',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: 'absolute',
        top: 0,
        left: 0,
    },
    // 2. THE CARD
    loginCard: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    heading: {
        margin: '0 0 20px 0',
        color: '#333',
        fontSize: '26px',
        fontWeight: '700',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#555',
        fontSize: '14px',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: '#fafafa',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '10px',
    },
    buttonHover: {
        backgroundColor: '#1d4ed8',
    },
    errorMessage: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        borderRadius: '6px',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid #fecaca',
    }
};

export default Login;