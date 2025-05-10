import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { getBankZBalances, BankZBalance } from '../lib/api';

interface BankZBalancesProps {
  customerId: string;
}

export default function BankZBalances({ customerId }: BankZBalancesProps) {
  const [balances, setBalances] = useState<BankZBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    getBankZBalances(customerId)
      .then((data) => {
        setBalances(data.balances);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data.error || 'Failed to fetch Bank Z balances');
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  if (!customerId) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Bank Z Balances
      </Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Typography color="error" sx={{ my: 2 }}>{error}</Typography>}
      {balances.length === 0 && !loading && !error && (
        <Typography>No Bank Z accounts found.</Typography>
      )}
      {balances.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account ID</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balances.map((balance) => (
              <TableRow key={balance.accountId}>
                <TableCell>{balance.accountId}</TableCell>
                <TableCell>${balance.balance.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}