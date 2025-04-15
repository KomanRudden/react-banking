'use client';

import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import CustomerForm from '../components/CustomerForm';
import AccountsList from '../components/AccountsList';

export default function Home() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const handleCustomerCreated = (customer: { customerId: string }) => {
    setSelectedCustomerId(customer.customerId);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ my: 4 }}>
        Banking Dashboard
      </Typography>
      <CustomerForm onCustomerCreated={handleCustomerCreated} />
      <AccountsList customerId={selectedCustomerId} />
    </Container>
  );
}