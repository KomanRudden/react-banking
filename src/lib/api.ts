import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Customer {
  customerId: string;
  currentAccountId: string;
  savingsAccountId: string;
}

export interface Account {
  id: string;
  customerId: string;
  type: 'current' | 'savings';
  balance: number;
  createdAt: string;
}

export const createCustomer = async (name: string, email: string): Promise<Customer> => {
  const response = await api.post('/api/customers', { name, email });
  return response.data;
};

export const getCustomerAccounts = async (customerId: string): Promise<{ customerId: string; accounts: Account[] }> => {
  const response = await api.get(`/api/customers/${customerId}/accounts`);
  return response.data;
};

export default api;