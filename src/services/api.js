import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to attach the Token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Grab token from storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Attach it!
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data) {
        localStorage.setItem('token', response.data);
    }
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
};
// ... existing code ...

// --- Rules & Dunning ---
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

// --- Payments ---
// export const processPayment = async (billId, amount, mode) => {
//     // We use query params because your controller expects @RequestParam
//     const response = await api.post(`/payments/pay/${billId}?amount=${amount}&mode=${mode}`);
//     return response.data;
// };
export const getAllCustomers1 = async () => {
    const response = await api.get('/admin/customers');
    return response.data;
};
// src/services/api.js

// NEW: Match TelecomServiceController
export const getCustomerServices = async (customerId) => {
    return axios.get(`${API_URL}/services/customer/${customerId}`).then(res => res.data);
};

// NEW: Match BillingController
export const getUnpaidBills = async (serviceId) => {
    return axios.get(`${API_URL}/bills/unpaid/${serviceId}`).then(res => res.data);
};

// NEW: Match PaymentController
export const processPayment = async (billId, amount, mode) => {
    // Backend expects params: /pay/{billId}?amount=X&mode=Y
    return axios.post(`${API_URL}/payments/pay/${billId}`, null, {
        params: { amount, mode }
    }).then(res => res.data);
};
// 2. The Profile Function (The fix for the 403 error)
export const getMyProfile = async () => {
    const token = localStorage.getItem('token');
    
    // Safety check: If no token, throw error before calling server
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/customer/my-profile`, {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    });

    return response.data;
};

export default api;