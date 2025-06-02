'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, Container, Stack, TextField, Typography, Paper } from '@mui/material';

export default function SmartSchedule() {
  const [activityData, setActivityData] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setSuggestion('');
    const prompt = `Suggest the best time/day to send a campaign based on this customer activity:\n${activityData}`;

    const res = await fetch('/api/ai/message-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objective: prompt }),
    });

    const data = await res.json();
    if (data.success) setSuggestion(data.suggestions.join('\n'));
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold">
          🕒 Smart Scheduling Suggestions
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Enter mock activity data (e.g. most opens Mon 9 AM, Tue 3 PM)"
          value={activityData}
          onChange={(e) => setActivityData(e.target.value)}
        />
        <Button variant="contained" onClick={handleGenerate}>
          Get Best Time
        </Button>
        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography>Evaluating...</Typography>
          </Box>
        )}
        {suggestion && (
          <Paper elevation={1} sx={{ p: 2 }}>
            {suggestion}
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
