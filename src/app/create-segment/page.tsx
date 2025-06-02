'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import {
  Box, Typography, Button, Select, MenuItem, TextField, IconButton, FormControl, InputLabel,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function CreateSegmentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rules, setRules] = useState([{ field: '', operator: '', value: '' }])
  const [logic, setLogic] = useState('AND')
  const [audienceSize, setAudienceSize] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/')
  }, [status])

  const updateRule = (index: number, key: string, value: string) => {
    const updated = [...rules]
    updated[index][key] = value
    setRules(updated)
  }

  const addRule = () => {
    setRules([...rules, { field: '', operator: '', value: '' }])
  }

  const removeRule = (index: number) => {
    const updated = [...rules]
    updated.splice(index, 1)
    setRules(updated)
  }

  const getAudienceSize = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/segments/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules, logic }),
      })
      const data = await res.json()
      setAudienceSize(data.size)
    } catch {}
  }

  const saveSegment = async () => {
    try {
      await fetch('http://localhost:3000/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules, logic, audienceSize }),
      })
      router.push('/campaigns')
    } catch {}
  }

  if (status === 'loading') return null

  return (
    <Box maxWidth="md" mx="auto" p={4}>
      <Typography variant="h4" mb={4}>Create Segment</Typography>

      {rules.map((rule, index) => (
        <Box key={index} display="flex" gap={2} mb={2} alignItems="center">
          <FormControl fullWidth>
            <InputLabel>Field</InputLabel>
            <Select
              value={rule.field}
              label="Field"
              onChange={e => updateRule(index, 'field', e.target.value)}
            >
              <MenuItem value="spend">Spend</MenuItem>
              <MenuItem value="visits">Visits</MenuItem>
              <MenuItem value="inactive_days">Inactive Days</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Operator</InputLabel>
            <Select
              value={rule.operator}
              label="Operator"
              onChange={e => updateRule(index, 'operator', e.target.value)}
            >
              <MenuItem value=">">{'>'}</MenuItem>
              <MenuItem value="<">{'<'}</MenuItem>
              <MenuItem value="=">=</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Value"
            value={rule.value}
            onChange={e => updateRule(index, 'value', e.target.value)}
            fullWidth
          />

          <IconButton onClick={() => removeRule(index)} color="error">
            <CloseIcon />
          </IconButton>
        </Box>
      ))}

      <Button onClick={addRule} variant="contained">Add Rule</Button>

      <Box display="flex" gap={2} alignItems="center" mt={4}>
        <Typography>Logic:</Typography>
        <Select value={logic} onChange={e => setLogic(e.target.value)}>
          <MenuItem value="AND">AND</MenuItem>
          <MenuItem value="OR">OR</MenuItem>
        </Select>
      </Box>

      <Box mt={4} display="flex" gap={2}>
        <Button variant="contained" color="success" onClick={getAudienceSize}>
          Preview Audience
        </Button>
        {audienceSize !== null && (
          <Typography variant="h6">Audience size: {audienceSize}</Typography>
        )}
      </Box>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={saveSegment}>
          Save Segment
        </Button>
      </Box>
    </Box>
  )
}
