'use client'

import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Chip, IconButton, Button, CircularProgress, Alert, Card, CardContent,
  TablePagination, Skeleton, TableContainer
} from '@mui/material'
import { useRouter } from 'next/navigation'
import RefreshIcon from '@mui/icons-material/Refresh'

interface Log {
  _id: string
  campaignId: {
    _id: string
    name: string
  } | null
  customerId: {
    _id: string
    name: string
    email: string
  } | null
  message: string
  status: 'SENT' | 'FAILED' | 'PENDING'
  createdAt: string
}

export default function LogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [initialLoading, setInitialLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/communication-logs')
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to fetch logs')
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setLogs(data)
      } else {
        console.error('Invalid response format:', data)
        setLogs([])
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
      setError(error instanceof Error ? error.message : 'Failed to load logs. Please try again later.')
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Calculate the logs to display based on pagination
  const displayedLogs = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (initialLoading) {
    return (
      <Box p={4} maxWidth="lg" mx="auto">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Skeleton variant="text" width={300} height={40} />
          <Box display="flex" gap={2}>
            <Skeleton variant="rectangular" width={180} height={36} />
            <Skeleton variant="rectangular" width={140} height={36} />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
        </Box>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                {['Campaign', 'Customer', 'Message', 'Status', 'Timestamp'].map((header) => (
                  <TableCell key={header}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(5)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton variant="text" />
                      {cellIndex === 1 && <Skeleton variant="text" width="60%" />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
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
    <Box p={4} maxWidth="lg" mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Campaign Delivery Logs</Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => router.push('/create-segment')}>
            Create New Campaign
          </Button>
          <Button variant="contained" onClick={() => router.push('/campaigns')}>
            View Campaigns
          </Button>
          <IconButton 
            onClick={fetchLogs} 
            color="primary" 
            title="Refresh logs"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Box>
      </Box>

      {logs.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" align="center">
              No logs found. Create and run a campaign to see delivery logs here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Paper>
          <TableContainer sx={{ minHeight: 400 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedLogs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log.campaignId?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {log.customerId ? (
                        <>
                          {log.customerId.name}<br />
                          <Typography variant="caption" color="textSecondary">
                            {log.customerId.email}
                          </Typography>
                        </>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>
                      <Chip 
                        label={log.status} 
                        color={log.status === 'SENT' ? 'success' : log.status === 'FAILED' ? 'error' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={logs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  )
}