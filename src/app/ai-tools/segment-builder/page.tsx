'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, Container, Stack, TextField, Typography, Paper } from '@mui/material';

export default function SegmentBuilder() {
  const [input, setInput] = useState('');
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setRules('');
    const prompt = `Convert this user segmentation description to logical JSON:\n"${input}"`;

    const res = await fetch('/api/ai/message-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objective: prompt }),
    });

    const data = await res.json();
    if (data.success) setRules(data.suggestions.join('\n'));
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold">
          🧠 Natural Language to Segment Rules
        </Typography>
        <TextField
          fullWidth
          label="Describe the audience rule"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          multiline
          rows={3}
        />
        <Button variant="contained" onClick={handleGenerate}>
          Generate Rules
        </Button>
        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography>Analyzing...</Typography>
          </Box>
        )}
        {rules && (
          <Paper elevation={1} sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
            {rules}
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
