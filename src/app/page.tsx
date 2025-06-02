'use client'

import { useSession, signIn } from 'next-auth/react'
import { Box, Button, Typography, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'
import Navbar from './components/Navbar'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <>
      
      <Box
        minHeight="80vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to Xeno CRM
        </Typography>

        <Typography variant="h6" mb={4} color="text.secondary">
          Your smart campaign management tool
        </Typography>

        {status === 'unauthenticated' && (
          <Button variant="contained" onClick={() => signIn('google')} sx={{ fontSize: 16 }}>
            Sign In with Google
          </Button>
        )}

        {session && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large" onClick={() => router.push('/create-segment')}>
              Create Segment
            </Button>
            <Button variant="outlined" size="large" onClick={() => router.push('/campaigns')}>
              View Campaigns
            </Button>
          </Stack>
        )}
      </Box>
    </>
  )
}
