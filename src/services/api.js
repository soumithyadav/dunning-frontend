import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// --- 1. Create the API Instance ---
const api = axios.create({
    baseURL: API_URL,
});

// --- 2. Auto-Attach Token Interceptor ---
// This acts like a gatekeeper: It adds the token to EVERY request automatically.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- 3. Authentication ---

export const login = async (username, password) => {
    // We use raw 'axios' here because we don't have a token yet
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
};

// --- 4. Customer Dashboard Functions (FIXED) ---

export const getMyProfile = async () => {
    // Uses 'api' -> Token automatically attached
    const response = await api.get('/customer/my-profile');
    return response.data;
};

// ⚠️ THIS WAS THE CAUSE OF YOUR ERROR ⚠️
export const getCustomerServices = async (customerId) => {
    // FIXED: Changed 'axios.get' to 'api.get'
    const response = await api.get(`/services/customer/${customerId}`);
    return response.data;
};

export const getUnpaidBills = async (serviceId) => {
    // FIXED: Changed 'axios.get' to 'api.get'
    // serviceId=serviceId-1;
    const response = await api.get(`/bills/unpaid/${serviceId}`);
    // console.log(response.data+" "+serviceId);
    
    return response.data;
};
export const processPayment = async (billId, amount, mode) => {
    // The Controller expects parameters in the URL query string
    // POST /api/payments/pay/{billId}?amount=XX&mode=XX
    const response = await api.post(`/payments/pay/${billId}`, null, {
        params: {
            amount: amount,
            mode: mode
        }
    });
    return response.data;
};

// --- 5. Admin Functions ---

export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
};

export const getAllCustomers1 = async () => {
    const response = await api.get('/admin/customers');
    return response.data;
};

export const getRules = async () => {
    const response = await api.get('/dunning/rules');
    return response.data;
};

export const createRule = async (ruleData) => {
    const response = await api.post('/dunning/rules', ruleData);
    return response.data;
};

export const runDunningProcess = async () => {
    const response = await api.post('/dunning/run');
    return response.data;
};
// Add this new function for Admin Override
export const updateServiceStatus = async (serviceId, newStatus) => {
    // PATCH request to update status
    // Example URL: /api/services/101/status?status=ACTIVE
    const response = await api.put(`/services/${serviceId}/status?status=${newStatus}`);
    return response.data;
};

export const deleteRule = async (ruleId) => {
    // Note: uses 'api.delete', not 'get' or 'post'
    const response = await api.delete(`/dunning/rules/${ruleId}`);
    return response.data;
};
// to get the logs from dunning controller

export const getSystemLogs = async () => {
    // Matches the controller endpoint: /api/dunning/logs
    const response = await api.get('/dunning/logs');
    return response.data;
};



export default api;