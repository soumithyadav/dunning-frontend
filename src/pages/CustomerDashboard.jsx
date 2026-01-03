import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import {
    getMyProfile,
    getCustomerServices,
    getUnpaidBills,
    processPayment
} from '../services/api';

const CustomerDashboard = () => {
    const [customer, setCustomer] = useState(null);
    const [service, setService] = useState(null); // The telecom service
    const [bill, setBill] = useState(null);       // The specific unpaid bill
    const [payStatus, setPayStatus] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Get Customer Profile
            const profileData = await getMyProfile();
            setCustomer(profileData);

            // 2. Get Services (TelecomServiceController)
            // We need the service ID to find bills
            const servicesData = await getCustomerServices(profileData.id);

            if (servicesData && servicesData.length > 0) {
                const mainService = servicesData[0]; // Assuming single service for now
                setService(mainService);

                // 3. Get Unpaid Bills (BillingController)
                const billsData = await getUnpaidBills(mainService.id);
                if (billsData && billsData.length > 0) {
                    setBill(billsData[0]); // Grab the oldest/first unpaid bill
                } else {
                    setBill(null); // No bills due
                }
            }
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayBill = async () => {
        if (!bill) return;

        try {
            // MATCHING BACKEND: PaymentController takes billId, amount, mode
            await processPayment(bill.id, bill.amount, "CARD");

            // UI Feedback from PDF [cite: 16]
            setPayStatus('✅ Payment Successful! Your services are now restored.');

            // Refresh data to show "Cured" status immediately
            setTimeout(() => {
                loadData();
                setPayStatus(''); // Clear message after refresh
            }, 3000);

        } catch (err) {
            console.error(err);
            setPayStatus('❌ Payment Failed. Please try again.');
        }
    };

    // Calculate Overdue Days
    const calculateOverdueDays = (dueDateString) => {
        if (!dueDateString) return 0;
        const due = new Date(dueDateString);
        const today = new Date();
        const diffTime = Math.abs(today - due);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return today > due ? diffDays : 0; // Only count if past due
    };

    if (loading) return <div style={centerStyle}>Loading account details...</div>;
    if (!customer) return <div style={centerStyle}>Error loading account.</div>;

    // Determine Status
    // If we just paid, service might still update, but we assume "Active" if no bills exist
    const currentStatus = service ? service.status : 'UNKNOWN';
    const isBlocked = currentStatus !== 'ACTIVE' && currentStatus !== 'CURED';
    const overdueDays = bill ? calculateOverdueDays(bill.dueDate) : 0;

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ padding: '40px', maxWidth: '100%', margin: '0 auto' }}>

                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ color: '#333' }}>Welcome, {customer.name}</h1>
                    <p style={{ color: '#666' }}>
                        Manage your {service?.planName || 'Telecom'} subscription.
                    </p>
                </div>

                {/* --- STATUS CARD --- */}
                {/* PDF Requirement: View Payment due, overdue days, and status [cite: 9] */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Service Status</h3>
                        <span style={isBlocked ? blockedBadge : activeBadge}>
                            {currentStatus}
                        </span>
                    </div>

                    {/* Show Overdue Days if applicable */}
                    {overdueDays > 0 && (
                        <div style={{ marginTop: '10px', color: '#dc3545', fontWeight: 'bold' }}>
                            📅 {overdueDays} Days Overdue
                        </div>
                    )}

                    {/* Status Message from PDF [cite: 10] */}
                    {isBlocked && (
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px' }}>
                            ⚠️ Your services are restricted due to non-payment.
                        </div>
                    )}
                </div>

                {/* --- BILLING CARD --- */}
                <div style={cardStyle}>
                    <h3 style={{ marginTop: 0 }}>Current Bill</h3>

                    {bill ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                            <div>
                                <p style={{ margin: '0 0 5px 0', color: '#666' }}>Amount Due</p>
                                {/* Dynamic Amount */}
                                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                                    ${bill.amount}
                                </span>
                                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
                                    Due Date: {bill.dueDate}
                                </p>
                            </div>

                            {/* Dynamic Payment Trigger [cite: 13] */}
                            <button onClick={handlePayBill} style={payButtonStyle}>
                                Pay Now
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px', color: 'green' }}>
                            ✅ No pending bills. You are all caught up!
                        </div>
                    )}

                    {/* Payment Feedback Message */}
                    {payStatus && (
                        <p style={{ marginTop: '15px', fontWeight: 'bold', color: payStatus.includes('✅') ? 'green' : 'red' }}>
                            {payStatus}
                        </p>
                    )}
                </div>

                {/* --- PROFILE CARD --- */}
                <div style={cardStyle}>
                    <h4 style={{ marginTop: 0, color: '#666' }}>My Profile</h4>
                    <p><strong>Email:</strong> {customer.user?.email}</p>
                    <p><strong>Phone:</strong> {customer.user?.phone}</p>
                    {/* Placeholder for Last Payment (Requires new Backend API) */}
                    <p><strong>Last Payment:</strong> {service?.lastPaymentDate || 'N/A'}</p>
                </div>

            </div>
        </div>
    );
};

// --- Styles ---
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#666' };
const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '20px' };
const activeBadge = { backgroundColor: '#d1e7dd', color: '#0f5132', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' };
const blockedBadge = { backgroundColor: '#f8d7da', color: '#842029', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' };
const payButtonStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 24px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };

export default CustomerDashboard;