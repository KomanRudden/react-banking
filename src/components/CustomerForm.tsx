import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { createCustomer } from '../lib/api';

interface CustomerFormProps {
  onCustomerCreated: (customer: { customerId: string }) => void;
}

export default function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const customer = await createCustomer(name, email);
      onCustomerCreated(customer);
      setName('');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data.errors?.join(', ') || 'Failed to create customer');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Customer
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Create
      </Button>
    </Box>
  );
}