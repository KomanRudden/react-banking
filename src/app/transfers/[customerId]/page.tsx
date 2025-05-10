'use client';

import { useParams } from 'next/navigation';
import { Container, Typography } from '@mui/material';
import TransferForm from '../../../components/TransferForm';

export default function TransfersPage() {
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

  const handleTransferSuccess = (transactionId: string) => {
    // Optionally redirect to transactions page or refresh accounts
    console.log(`Transfer completed: ${transactionId}`);
  };

  return (
    <Container sx={{ my: 4 }}>
      <TransferForm customerId={customerId} onTransferSuccess={handleTransferSuccess} />
    </Container>
  );
}