import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { createCustomer } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateUserPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', password: '', email: '',
        firstName: '', lastName: '', phone: '',
        serviceType: 'MOBILE', billingType: 'POSTPAID', serviceIdentifier: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.serviceType === 'MOBILE' && !formData.serviceIdentifier) {
                formData.serviceIdentifier = formData.phone;
            }

            const res = await createCustomer(formData);
            alert("✅ " + res);
            navigate('/customers'); 
        } catch (err) {
            setMessage('❌ Error: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>👤 Onboard New Customer</h1>
                {message && <p style={{ color: 'red' }}>{message}</p>}

                <form onSubmit={handleSubmit} style={formStyle}>

                    <h3 style={sectionHeader}>1. Login Credentials</h3>
                    <div style={rowStyle}>
                        <input name="username" placeholder="Username" onChange={handleChange} style={inputStyle} required />
                        <input name="password" type="password" placeholder="Temp Password" onChange={handleChange} style={inputStyle} required />
                    </div>
                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} style={{...inputStyle, width: '96%'}} required />

                    <h3 style={sectionHeader}>2. Personal Details</h3>
                    <div style={rowStyle}>
                        <input name="firstName" placeholder="First Name" onChange={handleChange} style={inputStyle} required />
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} style={inputStyle} required />
                    </div>
                    <input name="phone" placeholder="Phone Number (e.g. 9876543210)" onChange={handleChange} style={{...inputStyle, width: '96%'}} required />

                    <h3 style={sectionHeader}>3. Initial Service</h3>
                    <div style={rowStyle}>
                        <select name="serviceType" onChange={handleChange} style={inputStyle}>
                            <option value="MOBILE">Mobile</option>
                            <option value="BROADBAND">Broadband (Fiber)</option>
                            <option value="DTH">DTH (TV)</option>
                        </select>
                        <select name="billingType" onChange={handleChange} style={inputStyle}>
                            <option value="POSTPAID">Postpaid</option>
                            <option value="PREPAID">Prepaid</option>
                        </select>
                    </div>
                    <input 
                        name="serviceIdentifier" 
                        placeholder={formData.serviceType === 'MOBILE' ? "Service ID (Same as Phone)" : "Service ID (e.g. FIB-101)"}
                        onChange={handleChange} 
                        style={{...inputStyle, width: '96%'}} 
                    />

                    <button type="submit" style={submitBtnStyle}>Create Account</button>
                </form>
            </div>
        </div>
    );
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const rowStyle = { display: 'flex', gap: '10px' };
const inputStyle = { flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' };
const sectionHeader = { borderBottom: '2px solid #ddd', paddingBottom: '5px', marginTop: '20px', color: '#555' };
const submitBtnStyle = { padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' };

export default CreateUserPage;