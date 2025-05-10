import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { getCustomerAccounts, Account, createTransfer } from '../lib/api';

interface TransferFormProps {
  customerId: string;
  onTransferSuccess: (transactionId: string) => void;
}

export default function TransferForm({ customerId, onTransferSuccess }: TransferFormProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch customer accounts for dropdowns
  useEffect(() => {
    if (!customerId) return;
    getCustomerAccounts(customerId)
      .then((data) => {
        setAccounts(data.accounts);
      })
      .catch((err) => {
        setError('Failed to fetch accounts');
      });
  }, [customerId]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const amount = parseFloat(formData.amount);
    if (!formData.fromAccountId) {
      setError('Please select a source account');
      return;
    }
    if (!formData.toAccountId) {
      setError('Please select a destination account');
      return;
    }
    if (formData.fromAccountId === formData.toAccountId) {
      setError('Source and destination accounts cannot be the same');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    setLoading(true);
    try {
      const transfer = await createTransfer(
        customerId,
        formData.fromAccountId,
        formData.toAccountId,
        amount
      );
      setSuccess(`Transfer successful! Transaction ID: ${transfer.transactionId}`);
      onTransferSuccess(transfer.transactionId);
      setFormData({ fromAccountId: '', toAccountId: '', amount: '' });
    } catch (err: any) {
      setError(err.response?.data.error || err.response?.data.errors?.join(', ') || 'Failed to process transfer');
    } finally {
      setLoading(false);
    }
  };

  // Predefined Bank Z accounts
  const bankZAccounts = [
    { id: 'bankz-acc-123', label: 'Bank Z Account 123' },
    { id: 'bankz-acc-456', label: 'Bank Z Account 456' },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Initiate Transfer
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Source Account</InputLabel>
        <Select
          value={formData.fromAccountId}
          onChange={(e) => handleChange('fromAccountId', e.target.value)}
          label="Source Account"
          required
        >
          <MenuItem value="">Select Account</MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.type} ({account.id.slice(0, 8)}...) - ${account.balance.toFixed(2)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Destination Account</InputLabel>
        <Select
          value={formData.toAccountId}
          onChange={(e) => handleChange('toAccountId', e.target.value)}
          label="Destination Account"
          required
        >
          <MenuItem value="">Select Account</MenuItem>
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.type} ({account.id.slice(0, 8)}...) - ${account.balance.toFixed(2)}
            </MenuItem>
          ))}
          {bankZAccounts.map((bankZ) => (
            <MenuItem key={bankZ.id} value={bankZ.id}>
              {bankZ.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        required
        inputProps={{ min: 0.01, step: 0.01 }}
      />
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Processing...' : 'Transfer'}
      </Button>
    </Box>
  );
}