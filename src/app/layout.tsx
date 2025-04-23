'use client';

// import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import Navbar from '@/components/NavBar';

// export const metadata: Metadata = {
//   title: 'Banking Dashboard',
//   description: 'Manage accounts, transfers, and transactions',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}