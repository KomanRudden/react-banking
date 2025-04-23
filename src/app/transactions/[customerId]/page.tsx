'use client';

import { useParams } from 'next/navigation';
import { Container, Typography } from '@mui/material';
import TransactionTable from '../../../components/TransactionTable';

export default function TransactionsPage() {
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
      <TransactionTable customerId={customerId} />
    </Container>
  );
}