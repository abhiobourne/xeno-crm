'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material'

export default function CampaignLogsPage() {
  const { id } = useParams()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/communication-logs?campaignId=${id}`)
        const data = await res.json()
        setLogs(data)
      } catch (err) {
        console.error('Failed to fetch logs:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchLogs()
  }, [id])

  return (
    <Box p={4} maxWidth="lg" mx="auto">
      <Typography variant="h5" mb={4}>Delivery Logs</Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : logs.length === 0 ? (
        <Typography color="text.secondary">No delivery logs found for this campaign.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>{log.customerId?.name}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  )
}
