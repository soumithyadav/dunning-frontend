import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import Navbar from '../components/Navbar'; // <--- Import Navbar

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeServices: 0,
        blockedServices: 0,
        totalRevenueAtRisk: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    return (
        <div>
            <Navbar /> {/* <--- Add Navbar at the top */}
            
            <div style={{ padding: '40px', maxWidth: '100%', boxSizing:'border-box' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome back, Admin.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    
                    {/* Card 1 */}
                    <div style={cardStyle}>
                        <h3>Total Customers</h3>
                        <p style={numberStyle}>{stats.totalCustomers}</p>
                    </div>

                    {/* Card 2 */}
                    <div style={cardStyle}>
                        <h3>Active Services</h3>
                        <p style={{...numberStyle, color: 'green'}}>{stats.activeServices}</p>
                    </div>

                    {/* Card 3 */}
                    <div style={cardStyle}>
                        <h3>Blocked Users</h3>
                        <p style={{...numberStyle, color: 'red'}}>{stats.blockedServices}</p>
                    </div>

                    {/* Card 4 */}
                    <div style={cardStyle}>
                        <h3>Revenue Risk</h3>
                        <p style={{...numberStyle, color: 'orange'}}>{stats.totalRevenueAtRisk}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    textAlign: 'center'
};

const numberStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '10px 0 0 0'
};

export default Dashboard;   