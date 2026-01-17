import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ChatWidget from '../services/ChatWidget'; // Ensure path is correct
import {
    getMyProfile,
    getCustomerServices,
    getUnpaidBills,
    processPayment
} from '../services/api';

const CustomerDashboard = () => {
    const [customer, setCustomer] = useState(null);
    const [service, setService] = useState(null);
    
    // 🚨 CHANGED: Now storing an ARRAY of bills
    const [bills, setBills] = useState([]); 
    
    const [payStatus, setPayStatus] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Get Profile
            const profileData = await getMyProfile();
            setCustomer(profileData);

            // 2. Get Service
            const servicesData = await getCustomerServices(profileData.id);

            if (servicesData && servicesData.length > 0) {
                const mainService = servicesData[0];
                setService(mainService);

                // 3. Get All Unpaid Bills
                const billsData = await getUnpaidBills(mainService.id);
                
                // 🚨 CHANGED: Store ALL bills, not just the first one
                if (billsData && billsData.length > 0) {
                    setBills(billsData); 
                } else {
                    setBills([]); // Empty array if no bills
                }
            }
        } catch (err) {
            console.error("Failed to load data", err);
        } finally {
            setLoading(false);
        }
    };

    // 🚨 CHANGED: Now accepts specific ID and Amount for the clicked bill
    const handlePayBill = async (billId, billAmount) => {
        try {
            await processPayment(billId, billAmount, "CARD");

            setPayStatus(`✅ Payment of $${billAmount} Successful!`);

            // Refresh data to remove the paid bill from the list
            setTimeout(() => {
                loadData();
                setPayStatus('');
            }, 3000);

        } catch (err) {
            console.error(err);
            setPayStatus('❌ Payment Failed. Please try again.');
        }
    };

    const calculateOverdueDays = (dueDateString) => {
        if (!dueDateString) return 0;
        const due = new Date(dueDateString);
        const today = new Date();
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading) return <div style={centerStyle}>Loading...</div>;
    if (!customer) return <div style={centerStyle}>Error loading account.</div>;

    const currentStatus = service ? service.status : 'UNKNOWN';
    const isBlocked = currentStatus !== 'ACTIVE' && currentStatus !== 'CURED';
    

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ padding: '40px', maxWidth: '100%', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ color: '#333' }}>Welcome, {customer.name}</h1>
                    <p style={{ color: '#666' }}>Manage your subscription.</p>
                    
                    {/* Global Payment Status Message */}
                    {payStatus && (
                        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginTop: '10px' }}>
                            {payStatus}
                        </div>
                    )}
                </div>

                {/* --- 1. STATUS CARD --- */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Service Status</h3>
                        <span style={isBlocked ? blockedBadge : activeBadge}>
                            {currentStatus}
                        </span>
                    </div>
                    {isBlocked && (
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px' }}>
                            ⚠️ Services restricted. Please pay all pending bills.
                        </div>
                    )}
                </div>

                {/* --- 2. BILLS SECTION (LOOP) --- */}
                <h3 style={{ marginTop: '30px', color: '#444' }}>Pending Bills ({bills.length})</h3>
                
                {bills.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        
                        {/* 🚨 LOOPING THROUGH BILLS HERE */}
                        {bills.map((bill) => {
                            const daysOverdue = calculateOverdueDays(bill.dueDate);
                            
                            return (
                                <div key={bill.id} style={billCardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#555' }}>Bill #{bill.id}</span>
                                        {daysOverdue > 0 && (
                                            <span style={{ color: 'red', fontSize: '12px', fontWeight: 'bold' }}>
                                                {daysOverdue} Days Overdue
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                                        {bill.billAmount}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#777', marginBottom: '15px' }}>
                                        Due: {bill.dueDate}
                                    </div>

                                    <button 
                                        onClick={() => handlePayBill(bill.id, bill.billAmount)} 
                                        disabled={isBlocked}
                                        style={isBlocked ? { ...payButtonStyle, ...disabledButtonStyle } : payButtonStyle}
                                    >
                                        Pay Now
                                    </button>
                                    {isBlocked && (
                                        <button 
                                            onClick={() => alert('Contacting admin...')}
                                            style={contactAdminButtonStyle}
                                        >
                                            Contact Admin
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={cardStyle}>
                        <div style={{ color: 'green', textAlign: 'center', fontSize: '18px' }}>
                            ✅ No pending bills. You are all caught up!
                        </div>
                    </div>
                )}

                {/* --- 3. PROFILE CARD --- */}
                <div style={{ ...cardStyle, marginTop: '30px' }}>
                    <h4 style={{ marginTop: 0, color: '#666' }}>My Profile</h4>
                    <p><strong>Email:</strong> {customer.user?.email}</p>
                    <p><strong>Phone:</strong> {customer.user?.phone}</p>
                    <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '15px 0' }}/>
                    <p><strong>Last Payment:</strong> <span style={{color: 'green'}}>{service?.lastPaymentDate || 'N/A'}</span></p>
                    <p><strong>Next Bill Due:</strong> <span style={{color: '#007bff'}}>{service?.nextDueDate || 'N/A'}</span></p>
                </div>

            </div>
            <ChatWidget />
        </div>
    );
};

// --- Styles ---
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#666' };
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const billCardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: '5px solid #007bff' };
const activeBadge = { backgroundColor: '#d1e7dd', color: '#0f5132', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' };
const blockedBadge = { backgroundColor: '#f8d7da', color: '#842029', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' };
const payButtonStyle = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 0', width: '100%', fontSize: '16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' };
const disabledButtonStyle = { backgroundColor: '#6c757d', cursor: 'not-allowed', opacity: '0.6' };
const contactAdminButtonStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 0', width: '100%', fontSize: '16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' };

export default CustomerDashboard;