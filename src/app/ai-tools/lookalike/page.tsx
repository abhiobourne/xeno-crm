'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, Container, Stack, TextField, Typography, Paper } from '@mui/material';

export default function LookalikeGenerator() {
  const [traits, setTraits] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    const prompt = `Suggest how to find similar users based on these traits of high-performing customers:\n${traits}`;

    const res = await fetch('/api/ai/message-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objective: prompt }),
    });

    const data = await res.json();
    if (data.success) setResult(data.suggestions.join('\n'));
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold">
          👯 Audience Lookalike Generator
        </Typography>
        <TextField
          fullWidth
          label="Traits of successful segment (e.g. spent > ₹10K, age 30–45, clicked last 2 campaigns)"
          value={traits}
          onChange={(e) => setTraits(e.target.value)}
          multiline
          rows={3}
        />
        <Button variant="contained" onClick={handleGenerate}>
          Suggest Lookalikes
        </Button>
        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography>Identifying similar users...</Typography>
          </Box>
        )}
        {result && (
          <Paper elevation={1} sx={{ p: 2 }}>
            {result}
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
