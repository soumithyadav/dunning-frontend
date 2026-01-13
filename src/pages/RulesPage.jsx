import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getRules, createRule, runDunningProcess, deleteRule } from '../services/api';

const RulesPage = () => {
    const [rules, setRules] = useState([]);
    const [formData, setFormData] = useState({ overdueDays: '', action: 'BLOCK', channel: 'SMS' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const data = await getRules();
            setRules(data);
        } catch (err) { console.error("Failed to load rules"); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createRule(formData);
            setMessage('Rule Created Successfully!');
            loadRules(); 
            setFormData({ overdueDays: '', action: 'BLOCK', channel: 'SMS' }); 
        } catch (err) { setMessage('Error creating rule'); }
    };

    const handleRunDunning = async () => {
        try {
            const res = await runDunningProcess();
            setMessage('Success: ' + res);
        } catch (err) { setMessage('Error running process'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            try {
                await deleteRule(id);
                loadRules(); 
            } catch (err) {
                console.error(err);
                alert("Failed to delete rule");
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '40px', maxWidth: '100%', boxSizing: 'border-box' }}>
                <h1>Dunning Rules Control</h1>
                {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

                <div style={sectionStyle}>
                    <h3>⚙️ Manual Trigger</h3>
                    <p>Run the engine to check all customers against rules immediately.</p>
                    <button onClick={handleRunDunning} style={runButtonStyle}>RUN DUNNING PROCESS NOW</button>
                </div>

                <div style={sectionStyle}>
                    <h3>➕ Create New Rule</h3>
                    <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <label>
                            Days Overdue:
                            <input type="number" value={formData.overdueDays} onChange={e => setFormData({ ...formData, overdueDays: e.target.value })} style={inputStyle} required />
                        </label>
                        <label>
                            Action:
                            <select value={formData.action} onChange={e => setFormData({ ...formData, action: e.target.value })} style={inputStyle}>
                                <option value="BLOCK">BLOCK SERVICE</option>
                                <option value="RESTRICT">RESTRICT SERVICE</option>
                                <option value="NOTIFY">NOTIFY ONLY</option>
                            </select>
                        </label>
                        <button type="submit" style={buttonStyle}>Add Rule</button>
                    </form>
                </div>

                <h3>📜 Active Rules</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {rules.map(rule => (
                        <li key={rule.id} style={listItemStyle}>
                            <span>
                                <strong>If Overdue &gt; {rule.overdueDays} days</strong>
                                &nbsp;➜ THEN: <span style={{ color: 'red' }}>{rule.action}</span>
                                &nbsp;(via {rule.channel})
                            </span>

                            <button 
                                onClick={() => handleDelete(rule.id)} 
                                style={deleteBtnStyle}
                            >
                                🗑️ Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Styles
const sectionStyle = { marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' };
const runButtonStyle = { padding: '15px 30px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' };
const buttonStyle = { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const inputStyle = { display: 'block', padding: '8px', marginTop: '5px' };

const listItemStyle = { 
    padding: '15px', 
    borderBottom: '1px solid #eee', 
    fontSize: '18px',
    display: 'flex',                 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: 'white'
};

const deleteBtnStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
};

export default RulesPage;