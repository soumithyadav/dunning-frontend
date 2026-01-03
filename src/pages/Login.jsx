import React, { useEffect, useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        // OPTIONAL: This ensures no white borders from the body tag
        document.body.style.margin = "0"; 
        document.body.style.padding = "0";
        document.body.style.boxSizing = "border-box";

        // Cleanup function to reset body styles when leaving this page (optional)
        return () => {
            document.body.style.margin = "";
            document.body.style.padding = "";
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            console.log("Server details:", data);

            if (!data || !data.token) {
                throw new Error("Token missing in response");
            }
            
            localStorage.setItem('token', data.token);

            let role = "CUSTOMER";
            if (data.role) {
                role = data.role.toUpperCase().replace('ROLE_', '');
            }
            localStorage.setItem('role', role);

            if (role === 'ADMIN') {
                navigate('/dashboard');
            } else {
                navigate('/my-account'); 
            }
        } catch (err) {
            console.error(err);
            setError('Invalid Credentials');
        }
    };

    return (
        // The outer div acts as the full-page background
        <div style={styles.pageContainer}>
            <div style={styles.loginCard}>
                <h2 style={styles.heading}>Dunning System Login</h2>
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="username" style={styles.label}>Username</label>
                        <input
                            type="text"
                            id="username"
                            // autoComplete="username"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
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
        display: 'flex',            // Enables Flexbox
        justifyContent: 'center',   // Centers horizontally
        alignItems: 'center',       // Centers vertically
        minHeight: '100vh',         // Takes full viewport height
        width: '100vw',             // Takes full viewport width
        backgroundColor: '#f4f7f6', // Light grey background
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: 'absolute',       // Forces it to sit on top of everything
        top: 0,
        left: 0,
    },
    // 2. THE CARD
    loginCard: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', // Soft shadow
        width: '100%',
        maxWidth: '400px',          // Prevents it from getting too wide
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
        boxSizing: 'border-box', // Crucial for keeping padding inside width
        outline: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: '#fafafa',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#2563eb', // Nice modern blue
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
        backgroundColor: '#1d4ed8', // Darker blue on hover
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