'use client'

import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, CircularProgress, TablePagination,
  TableContainer, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material'
import { Download } from 'lucide-react'

export default function LogsPage() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs')
        if (!res.ok) throw new Error('Failed to fetch logs')
        const data = await res.json()
        setLogs(data)
        setFilteredLogs(data)
      } catch (err) {
        console.error('Error fetching logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const handleChangePage = (_, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value)
    setPage(0)
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearch(term)
    const filtered = logs.filter(log =>
      log.campaignName.toLowerCase().includes(term) ||
      log.customerName.toLowerCase().includes(term) ||
      log.status.toLowerCase().includes(term)
    )
    setFilteredLogs(filtered)
    setPage(0)
  }

  const exportCSV = () => {
    const headers = ['Campaign', 'Customer', 'Message', 'Status', 'Timestamp']
    const rows = filteredLogs.map(log => [
      log.campaignName,
      log.customerName,
      log.message,
      log.status,
      new Date(log.timestamp).toLocaleString()
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'logs.csv'
    a.click()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box p={4} maxWidth="lg" mx="auto">
      <Typography variant="h4" mb={2}>Communication Logs</Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search Logs"
          variant="outlined"
          value={search}
          onChange={handleSearch}
        />
        <Button variant="contained" onClick={exportCSV} startIcon={<Download size={18} />}>
          Export CSV
        </Button>
      </Box>

      <Paper>
        <TableContainer>
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
              {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => (
                <TableRow key={i} onClick={() => setSelectedLog(log)} style={{ cursor: 'pointer' }}>
                  <TableCell>{log.campaignName}</TableCell>
                  <TableCell>{log.customerName}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.status}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)}>
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <DialogContentText component="div">
              <p><strong>Campaign:</strong> {selectedLog.campaignName}</p>
              <p><strong>Customer:</strong> {selectedLog.customerName}</p>
              <p><strong>Message:</strong> {selectedLog.message}</p>
              <p><strong>Status:</strong> {selectedLog.status}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLog(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}