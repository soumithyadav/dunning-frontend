import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getAllCustomers1 } from '../services/api';


const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getAllCustomers1();
            setCustomers(data);
        } catch (err) {
            console.error("Failed to load customers", err);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '100%', margin: '0 auto' }}>
                <h1>👥 Customer Directory</h1>
                
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(cust => (
                            <tr key={cust.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={tdStyle}>#{cust.id}</td>
                                <td style={tdStyle}>{cust.name} {cust.lastName}</td>
                                <td style={tdStyle}>{cust.user?.email}</td>
                                <td style={tdStyle}>{cust.user?.phone}</td>
                                <td style={tdStyle}>
                                    <span style={cust.user?.status === 'ACTIVE' ? activeBadge : blockedBadge}>
                                        {cust.user?.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- CSS Styles for Table ---
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };

const activeBadge = {
    backgroundColor: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '12px'
};

const blockedBadge = {
    backgroundColor: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '12px'
};

export default CustomersPage;