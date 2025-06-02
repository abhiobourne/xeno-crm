'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper
} from '@mui/material'
import { useRouter } from 'next/navigation'
useRouter

export default function CampaignsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
  }, [status])

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/campaigns')
        const data = await res.json()
        setCampaigns(data)
      } catch {}
    }

    if (status === 'authenticated') fetchCampaigns()
  }, [status])

  if (status === 'loading') return null

  return (
    <Box p={4} maxWidth="lg" mx="auto">
      <Typography variant="h4" mb={4}>Campaign History</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Campaign</TableCell>
              <TableCell>Audience</TableCell>
              <TableCell>Sent</TableCell>
              <TableCell>Failed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((c, i) => (
              <TableRow key={i}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.audience}</TableCell>
                <TableCell>{c.sent}</TableCell>
                <TableCell>{c.failed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
