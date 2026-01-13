import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role') || '';

    const handleLogout = () => {
        localStorage.clear(); 
        navigate('/'); 
    };

    return (
        <nav style={navStyle}>
            <h2 style={{ margin: 5 }}>Prodapt Dunning</h2>
            
            <div style={linkContainer}>

                {role === 'ROLE_ADMIN' && (
                    <>
                        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                        <Link to="/customers-list" style={linkStyle}>Customers</Link>
                        <Link to="/rules" style={linkStyle}>Rules Engine</Link>
                        <Link to="/payments" style={linkStyle}>Payment Sim</Link>
                        <Link to="/logs" style={linkStyle}>Audit Logs</Link>
                        <Link to="/admin/create" style={linkStyle}>➕ Add Customer</Link>
                    </>
                )}

                {role === 'ROLE_CUSTOMER' && (
                    <span style={{ color: '#e0e0e0', marginRight: '15px' }}>Dashboard</span>
                )}

                <button onClick={handleLogout} style={buttonStyle}>Logout</button>
            </div>
        </nav>
    );
};

const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff', 
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const linkContainer = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const buttonStyle = {
    padding: '5px 15px',
    backgroundColor: 'white',
    color: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default Navbar;