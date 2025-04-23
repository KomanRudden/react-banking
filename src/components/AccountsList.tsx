'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import { getCustomerAccounts, Account } from '../lib/api';

interface AccountsListProps {
  customerId: string;
}

export default function AccountsList({ customerId }: AccountsListProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    getCustomerAccounts(customerId)
      .then((data) => {
        setAccounts(data.accounts);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data.error || 'Failed to fetch accounts');
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  if (!customerId) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Accounts
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {accounts.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.type}</TableCell>
                <TableCell>${account.balance.toFixed(2)}</TableCell>
                <TableCell>{new Date(account.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}