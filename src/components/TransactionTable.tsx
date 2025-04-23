'use client';

import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Account, getCustomerAccounts, getTransactions, Transaction } from '../lib/api';

interface TransactionTableProps {
  customerId: string;
}

export default function TransactionTable({ customerId }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filters, setFilters] = useState<{ accountId: string; type: string }>({ accountId: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts for accountId filter dropdown
  useEffect(() => {
    if (!customerId) return;
    getCustomerAccounts(customerId)
      .then((data) => {
        setAccounts(data.accounts);
      })
      .catch((err) => {
        console.error('Failed to fetch accounts:', err);
      });
  }, [customerId]);

  // Fetch transactions when customerId or filters change
  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    getTransactions(customerId, filters)
      .then((data) => {
        setTransactions(data.transactions);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data.error || 'Failed to fetch transactions');
      })
      .finally(() => setLoading(false));
  }, [customerId, filters]);

  const handleFilterChange = (key: 'accountId' | 'type', value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (!customerId) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Account</InputLabel>
          <Select
            value={filters.accountId}
            onChange={(e) => handleFilterChange('accountId', e.target.value)}
            label="Account"
          >
            <MenuItem value="">All Accounts</MenuItem>
            {accounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.type} ({account.id.slice(0, 8)}...)
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            label="Type"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="bonus">Bonus</MenuItem>
            <MenuItem value="transfer">Transfer</MenuItem>
            <MenuItem value="fee">Fee</MenuItem>
            <MenuItem value="interest">Interest</MenuItem>
            <MenuItem value="bankz_transfer">Bank Z Transfer</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}
      {transactions.length === 0 && !loading && !error && (
        <Typography>No transactions found.</Typography>
      )}
      {transactions.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>From Account</TableCell>
              <TableCell>To Account</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.id.slice(0, 8)}...</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>${tx.amount.toFixed(2)}</TableCell>
                <TableCell>{tx.fromAccountId ? tx.fromAccountId.slice(0, 8) + '...' : '-'}</TableCell>
                <TableCell>{tx.toAccountId ? tx.toAccountId.slice(0, 8) + '...' : '-'}</TableCell>
                <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}