import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RulesPage from './pages/RulesPage';     
import PaymentPage from './pages/PaymentPage'; 
import CustomersPage from './pages/CustomersPage';
import CustomerDashboard from './pages/CustomerDashboard';
import LogsPage from './pages/LogsPage';
import CreateUserPage from './pages/CreateUserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rules" element={<RulesPage />} />      
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/customers-list" element={<CustomersPage />} />
        <Route path="/my-account" element={<CustomerDashboard />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/admin/create" element={<CreateUserPage/>}/>
        <Route path="/customers" element={<CustomersPage />} />
        {/* DEBUGGING HELP: CATCH ALL */}
        <Route path="*" element={<h2 style={{color:'red'}}>404 - Page Not Found (Check URL)</h2>} />
      </Routes>
    </Router>
  );
}

export default App;