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
    console.log(response.data+" "+serviceId);
    
    return response.data;
};

export const processPayment = async (billId, amount, mode) => {
    // FIXED: Changed 'axios.post' to 'api.post'
    const response = await api.post(`/payments/pay`, { 
        billId, 
        amount, 
        paymentMode: mode 
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

export default api;