'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function CampaignSummary() {
  const [inputs, setInputs] = useState({ audienceSize: '', sent: '', failed: '' });
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const getSummary = async () => {
    setLoading(true);
    setSummary('');
    const res = await fetch('/api/ai/summary', {
      method: 'POST',
      body: JSON.stringify(inputs),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.success) setSummary(data.summary);
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold">
          📊 AI Campaign Summary
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Audience Size"
          value={inputs.audienceSize}
          onChange={(e) => setInputs({ ...inputs, audienceSize: e.target.value })}
        />
        <TextField
          fullWidth
          type="number"
          label="Sent"
          value={inputs.sent}
          onChange={(e) => setInputs({ ...inputs, sent: e.target.value })}
        />
        <TextField
          fullWidth
          type="number"
          label="Failed"
          value={inputs.failed}
          onChange={(e) => setInputs({ ...inputs, failed: e.target.value })}
        />
        <Button variant="contained" color="success" onClick={getSummary}>
          Get Summary
        </Button>

        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} color="success" />
            <Typography variant="body2" color="text.secondary">
              Generating summary...
            </Typography>
          </Box>
        )}

        {summary && (
          <Paper elevation={1} sx={{ mt: 2, p: 2 }}>
            <Typography>{summary}</Typography>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
