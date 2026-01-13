import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

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


export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
};


export const getMyProfile = async () => {
    const response = await api.get('/customer/my-profile');
    return response.data;
};

export const getCustomerServices = async (customerId) => {
    const response = await api.get(`/services/customer/${customerId}`);
    return response.data;
};

export const getUnpaidBills = async (serviceId) => {
    const response = await api.get(`/bills/unpaid/${serviceId}`);
    // console.log(response.data+" "+serviceId);
    
    return response.data;
};
export const processPayment = async (billId, amount, mode) => {
    const response = await api.post(`/payments/pay/${billId}`, null, {
        params: {
            amount: amount,
            mode: mode
        }
    });
    return response.data;
};

// Admin Functions 
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
export const updateServiceStatus = async (serviceId, newStatus) => {
    const response = await api.put(`/services/${serviceId}/status?status=${newStatus}`);
    return response.data;
};

export const deleteRule = async (ruleId) => {
    const response = await api.delete(`/dunning/rules/${ruleId}`);
    return response.data;
};

export const getSystemLogs = async () => {
    const response = await api.get('/dunning/logs');
    return response.data;
};

// openai
export const sendChatMessage = async (message) => {
    const response = await api.post('/chat/ask', { message });
    return response.data.response; 
};
// create new customer in customers page
export const createCustomer = async (customerData) => {
    const response = await api.post('/admin/create-customer', customerData);
    return response.data;
};

export default api;