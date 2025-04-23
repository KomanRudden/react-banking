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

export interface Transaction {
    id: string;
    accountId: string;
    customerId: string;
    type: string;
    amount: number;
    fromAccountId?: string;
    toAccountId?: string;
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

export const getTransactions = async (
    customerId: string,
    filters: { accountId?: string; type?: string }
  ): Promise<{ customerId: string; transactions: Transaction[] }> => {
    const params = new URLSearchParams();
    if (filters.accountId) params.append('accountId', filters.accountId);
    if (filters.type) params.append('type', filters.type);
    const response = await api.get(`/api/customers/${customerId}/transactions`, { params });
    return response.data;
  };

export default api;