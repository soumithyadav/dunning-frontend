import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getSystemLogs } from '../services/api';

const LogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const data = await getSystemLogs();
            setLogs(data);
        } catch (err) {
            console.error("Failed to load logs", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '100%', margin: '0 auto' }}>
                <h1>📜 System Audit Logs</h1>
                <p>Track all admin actions, rule triggers, and payments.</p>

                {loading ? (
                    <p>Loading logs...</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                                    <th style={thStyle}>Time</th>
                                    <th style={thStyle}>Admin/User</th>
                                    <th style={thStyle}>Action</th>
                                    <th style={thStyle}>Target Entity</th>
                                    <th style={thStyle}>Entity ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log.id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={tdStyle}>
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={userBadge}>{log.username}</span>
                                            </td>
                                            <td style={tdStyle}>
                                                {/* Color code actions based on type */}
                                                <span style={getActionStyle(log.action)}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>{log.entityType}</td>
                                            <td style={tdStyle}>#{log.entityId}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                                            No logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Styles & Helpers ---

const getActionStyle = (action) => {
    const base = { padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' };
    if (action.includes('PAYMENT')) return { ...base, backgroundColor: '#d1e7dd', color: '#0f5132' }; // Green
    if (action.includes('BLOCK') || action.includes('DELETE')) return { ...base, backgroundColor: '#f8d7da', color: '#842029' }; // Red
    if (action.includes('CREATE') || action.includes('UPDATE')) return { ...base, backgroundColor: '#cff4fc', color: '#055160' }; // Blue
    return { ...base, backgroundColor: '#e2e3e5', color: '#383d41' }; // Grey default
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' };
const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
const userBadge = { fontWeight: 'bold', color: '#007bff' };

export default LogsPage;