'use client';

import { useParams } from 'next/navigation';
import { Container, Typography } from '@mui/material';
import BankZBalances from '../../../components/BankZBalances';

export default function BankZBalancesPage() {
  const params = useParams();
  const customerId = params.customerId as string;

  if (!customerId) {
    return (
      <Container sx={{ my: 4 }}>
        <Typography variant="h6" color="error">
          Please select a customer.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ my: 4 }}>
      <BankZBalances customerId={customerId} />
    </Container>
  );
}