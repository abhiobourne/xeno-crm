'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material'
import { useRouter } from 'next/navigation'

interface Campaign {
  _id: string
  name: string
  segmentId: {
    _id: string
    name: string
  } | null
  messageTemplate: string
  audienceSize: number
  status: string
  createdAt: string
}

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/campaigns')
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setCampaigns(data)
      } else {
        setCampaigns([])
        console.error('Invalid campaigns data format:', data)
      }
    } catch (err) {
      setError('Failed to load campaigns. Please try again later.')
      console.error('Error fetching campaigns:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'FAILED':
        return 'error'
      case 'PENDING':
        return 'warning'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Campaign History</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push('/logs')}
          >
            View Logs
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/create-segment')}
          >
            Create New Campaign
          </Button>
        </Box>
      </Box>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" align="center">
              No campaigns found. Create your first campaign to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Segment</TableCell>
                <TableCell>Audience Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign._id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.segmentId?.name || 'N/A'}</TableCell>
                  <TableCell>{campaign.audienceSize}</TableCell>
                  <TableCell>
                    <Chip
                      label={campaign.status}
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      color={getStatusColor(campaign.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}