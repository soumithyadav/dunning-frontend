import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RulesPage from './pages/RulesPage';     // <--- Import
import PaymentPage from './pages/PaymentPage'; // <--- Import
import CustomersPage from './pages/CustomersPage'; // Import
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rules" element={<RulesPage />} />      {/* <--- Add Route */}
        <Route path="/payments" element={<PaymentPage />} /> {/* <--- Add Route */}
        <Route path="/customers-list" element={<CustomersPage />} />
        <Route path="/my-account" element={<CustomerDashboard />} />
        {/* DEBUGGING HELP: CATCH ALL */}
        <Route path="*" element={<h2 style={{color:'red'}}>404 - Page Not Found (Check URL)</h2>} />
      </Routes>
    </Router>
  );
}

export default App;