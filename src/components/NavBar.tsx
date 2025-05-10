'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const [customerId, setCustomerId] = useState('');
  const router = useRouter();

  const handleCustomerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerId(e.target.value);
  };

  const handleGoToTransactions = () => {
    if (customerId) {
      router.push(`/transactions/${customerId}`);
    }
  };

  const handleGoToTransfers = () => {
    if (customerId) {
      router.push(`/transfers/${customerId}`);
    }
  };

  const handleGoToBankZBalances = () => {
    if (customerId) {
      router.push(`/bankz-balances/${customerId}`);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Banking Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          <input
            type="text"
            placeholder="Enter Customer ID"
            value={customerId}
            onChange={handleCustomerIdChange}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              maxWidth: '200px',
            }}
          />
          <Button color="inherit" onClick={handleGoToTransactions} disabled={!customerId}>
            Transactions
          </Button>
          <Button color="inherit" onClick={handleGoToTransfers} disabled={!customerId}>
            Transfers
          </Button>
          <Button color="inherit" onClick={handleGoToBankZBalances} disabled={!customerId}>
            Bank Z Balances
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}