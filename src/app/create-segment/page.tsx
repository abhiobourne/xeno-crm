'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Typography, Button, Select, MenuItem, TextField, IconButton, FormControl, InputLabel,
  Alert, Snackbar, Paper, Chip, Stack
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { generateMessageSuggestions, autoCategorizeCampaign } from '@/lib/aiHandler'

interface Rule {
  field: string
  operator: string
  value: string
}

export default function CreateSegmentPage() {
  const router = useRouter()
  const [rules, setRules] = useState<Rule[]>([{ field: '', operator: '', value: '' }])
  const [logic, setLogic] = useState('AND')
  const [audienceSize, setAudienceSize] = useState<number | null>(null)
  const [campaignName, setCampaignName] = useState('')
  const [messageTemplate, setMessageTemplate] = useState('Hi {name}, here\'s 10% off on your next order!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [messageSuggestions, setMessageSuggestions] = useState<string[]>([])
  const [campaignTags, setCampaignTags] = useState<string[]>([])

  const updateRule = (index: number, key: keyof Rule, value: string) => {
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

  const validateForm = () => {
    if (!campaignName.trim()) {
      setError('Please enter a campaign name')
      return false
    }
    if (!messageTemplate.trim()) {
      setError('Please enter a message template')
      return false
    }
    if (rules.some(rule => !rule.field || !rule.operator || !rule.value)) {
      setError('Please fill in all rule fields')
      return false
    }
    if (audienceSize === null) {
      setError('Please preview audience size before saving')
      return false
    }
    return true
  }

  const getAudienceSize = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:3000/api/segments/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules, logic }),
      })
      if (!res.ok) throw new Error('Failed to preview audience')
      const data = await res.json()
      setAudienceSize(data.size)
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      setError('Failed to preview audience size')
    } finally {
      setLoading(false)
    }
  }

  const getAudienceDescription = () => {
    const descriptions = rules.map(rule => {
      return `${rule.field} ${rule.operator} ${rule.value}`
    })
    return descriptions.join(` ${logic} `)
  }

  const generateSuggestions = async () => {
    try {
      setLoading(true)
      const objective = `Create a campaign message for customers where ${getAudienceDescription()}`
      const suggestions = await generateMessageSuggestions(objective)
      setMessageSuggestions(suggestions)
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      setError('Failed to generate message suggestions')
    } finally {
      setLoading(false)
    }
  }

  const generateTags = async () => {
    try {
      setLoading(true)
      const audienceDescription = getAudienceDescription()
      const tags = await autoCategorizeCampaign(messageTemplate, audienceDescription)
      setCampaignTags(tags)
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      setError('Failed to generate campaign tags')
    } finally {
      setLoading(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    setMessageTemplate(suggestion)
  }

  const saveSegment = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      // First create the segment
      const segmentRes = await fetch('http://localhost:3000/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules, logic, audienceSize }),
      })
      if (!segmentRes.ok) throw new Error('Failed to create segment')
      const segment = await segmentRes.json()

      // Then create the campaign
      const campaignRes = await fetch('http://localhost:3000/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          segmentId: segment.id,
          messageTemplate,
          audienceSize,
          tags: campaignTags
        }),
      })
      if (!campaignRes.ok) throw new Error('Failed to create campaign')
      
      router.push('/campaigns')
    } catch (error) {
      setError('Failed to save segment and create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth="md" mx="auto" p={4}>
      <Typography variant="h4" mb={4}>Create Campaign</Typography>

      <Box mb={4}>
        <TextField
          label="Campaign Name"
          value={campaignName}
          onChange={e => setCampaignName(e.target.value)}
          fullWidth
          required
        />
      </Box>

      <Box mb={4}>
        <Box display="flex" gap={2} alignItems="start" mb={2}>
          <TextField
            label="Message Template"
            value={messageTemplate}
            onChange={e => setMessageTemplate(e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
            helperText="Use {name} to personalize the message"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={generateSuggestions}
            disabled={loading}
            startIcon={<AutoFixHighIcon />}
            sx={{ minWidth: '180px' }}
          >
            Get AI Suggestions
          </Button>
        </Box>

        {messageSuggestions.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" mb={1}>AI Suggestions:</Typography>
            <Stack spacing={1}>
              {messageSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => applySuggestion(suggestion)}
                  sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                >
                  {suggestion}
                </Button>
              ))}
            </Stack>
          </Paper>
        )}
      </Box>

      <Typography variant="h6" mb={2}>Segment Rules</Typography>

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

      <Button onClick={addRule} variant="contained" sx={{ mb: 4 }}>Add Rule</Button>

      <Box display="flex" gap={2} alignItems="center" mb={4}>
        <Typography>Logic:</Typography>
        <Select value={logic} onChange={e => setLogic(e.target.value)}>
          <MenuItem value="AND">AND</MenuItem>
          <MenuItem value="OR">OR</MenuItem>
        </Select>
      </Box>

      <Box display="flex" gap={2} mb={4}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={getAudienceSize}
          disabled={loading}
        >
          Preview Audience
        </Button>
        {audienceSize !== null && (
          <Typography variant="h6">Audience size: {audienceSize}</Typography>
        )}
      </Box>

      <Box mb={4}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={generateTags}
          disabled={loading}
          startIcon={<AutoFixHighIcon />}
        >
          Generate Tags
        </Button>
        {campaignTags.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" mb={1}>Campaign Tags:</Typography>
            <Stack direction="row" spacing={1}>
              {campaignTags.map((tag, index) => (
                <Chip key={index} label={tag} color="primary" />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={saveSegment}
        disabled={loading}
      >
        Create Campaign
      </Button>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}