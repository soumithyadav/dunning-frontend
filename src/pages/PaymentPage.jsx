import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { processPayment } from '../services/api';

const PaymentPage = () => {
    const [billId, setBillId] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    const handlePay = async (e) => {
        e.preventDefault();
        try {
            const res = await processPayment(billId, amount, "UPI");
            setStatus('✅ ' + res); // "Payment successful"
        } catch (err) {
            setStatus('❌ Payment Failed (Check Bill ID)');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '100%', margin: '0 auto', textAlign: 'center' }}>
                <h1>💳 Payment Simulator</h1>
                <p>Simulate a customer paying their bill to test Unblocking logic.</p>

                <form onSubmit={handlePay} style={{ border: '1px solid #ccc', padding: '30px', borderRadius: '10px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <input 
                            type="number" placeholder="Enter Bill ID" 
                            value={billId} onChange={e => setBillId(e.target.value)}
                            style={inputStyle} required 
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input 
                            type="number" placeholder="Amount ($)" 
                            value={amount} onChange={e => setAmount(e.target.value)}
                            style={inputStyle} required 
                        />
                    </div>
                    <button type="submit" style={payButtonStyle}>PAY NOW</button>
                </form>

                {status && <h3 style={{ marginTop: '20px' }}>{status}</h3>}
            </div>
        </div>
    );
};

const inputStyle = { padding: '10px', width: '80%', fontSize: '16px' };
const payButtonStyle = { padding: '10px 40px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' };

export default PaymentPage;