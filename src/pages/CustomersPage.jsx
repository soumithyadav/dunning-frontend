import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getAllCustomers1, updateServiceStatus } from '../services/api'; // <--- Ensure updateServiceStatus is imported

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false); // <--- Added missing state
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getAllCustomers1();
            setCustomers(data);
            setFilteredCustomers(data);
        } catch (err) {
            console.error("Failed to load customers", err);
        }
    };

    const handleSearch = async (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = customers.filter(cust => {
            const idMatch = cust.id.toString().includes(term);
            const phoneMatch = cust.user?.phone && cust.user.phone.toLowerCase().includes(term);
            const nameMatch = cust.name.toLowerCase().includes(term);
            return idMatch || phoneMatch || nameMatch;
        })
        setFilteredCustomers(filtered)
    }

    const handleStatusChange = async (serviceId, newStatus) => {
        if (!window.confirm(`Are you sure you want to set this service to ${newStatus}?`)) return;

        setLoading(true);
        try {
            await updateServiceStatus(serviceId, newStatus);
            alert(`✅ Service updated to ${newStatus}`);
            loadCustomers();
            setSearchTerm('')
        } catch (err) {
            console.error(err);
            alert('❌ Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const renderStatus = (cust) => {
        const service = cust.services && cust.services.length > 0 ? cust.services[0] : null;
        const displayStatus = service ? service.status : (cust.user?.status || 'N/A');

        // Remove 'ACTIVE' from this list so it shows as green
        const isBadStatus = ['RESTRICTED', 'BLOCKED', 'SUSPENDED', 'INACTIVE'].includes(displayStatus);

        return (
            <span style={isBadStatus ? blockedBadge : activeBadge}>
                {displayStatus}
            </span>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '100%', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>👥 Customer Directory</h1>

                    {/* --- NEW: SEARCH BAR --- */}
                    <input
                        type="text"
                        placeholder="🔍 Search by ID, Phone, or Name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={searchStyle}
                    />
                </div>
            </div>
            <div>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length>0?(
                            filteredCustomers.map(cust=>{
                            // --- FIX START: Define variables here ---
                            const service = cust.services && cust.services.length > 0 ? cust.services[0] : null;
                            const isBlocked = service && ['BLOCKED', 'SUSPENDED', 'RESTRICTED'].includes(service.status);
                            // --- FIX END ---

                            return (
                                <tr key={cust.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={tdStyle}>#{cust.id}</td>
                                    <td style={tdStyle}>{cust.name} {cust.lastName}</td>
                                    <td style={tdStyle}>{cust.user?.email}</td>
                                    <td style={tdStyle}>{cust.user?.phone}</td>

                                    <td style={tdStyle}>
                                        {renderStatus(cust)}
                                    </td>

                                    <td style={tdStyle}>
                                        {service ? (
                                            <>
                                                {isBlocked ? (
                                                    <button
                                                        onClick={() => handleStatusChange(service.id, 'ACTIVE')}
                                                        style={activateBtnStyle}
                                                        disabled={loading}
                                                    >
                                                        ✅ Activate
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusChange(service.id, 'BLOCKED')}
                                                        style={blockBtnStyle}
                                                        disabled={loading}
                                                    >
                                                        ⛔ Block
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <span style={{ color: '#999' }}>No Service</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{textAlign:'center', padding:'20px', color:'#777'}}>
                                    No customers found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- CSS Styles ---
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };

const activeBadge = {
    backgroundColor: '#d1e7dd', color: '#0f5132', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '12px'
};

const blockedBadge = {
    backgroundColor: '#f8d7da', color: '#842029', padding: '5px 10px', borderRadius: '15px', fontWeight: 'bold', fontSize: '12px'
};

const activateBtnStyle = {
    backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
};

const blockBtnStyle = {
    backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
};
const searchStyle = {
    padding: '10px 15px',
    width: '300px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

export default CustomersPage;