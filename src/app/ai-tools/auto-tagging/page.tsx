'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, Container, Stack, TextField, Typography, Paper } from '@mui/material';

export default function AutoTagging() {
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTag = async () => {
    setLoading(true);
    setTags('');
    const prompt = `Label this campaign with 1–2 tags based on the message and audience.\nMessage: "${message}"\nAudience: "${audience}"`;

    const res = await fetch('/api/ai/message-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objective: prompt }),
    });

    const data = await res.json();
    if (data.success) setTags(data.suggestions.join('\n'));
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold">
          🏷️ Auto-tag Campaigns
        </Typography>
        <TextField
          fullWidth
          label="Campaign Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          fullWidth
          label="Audience Description"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
        <Button variant="contained" onClick={handleTag}>
          Generate Tags
        </Button>
        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography>Analyzing campaign intent...</Typography>
          </Box>
        )}
        {tags && (
          <Paper elevation={1} sx={{ p: 2 }}>
            {tags}
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
