'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export default function MessageSuggestions() {
  const [objective, setObjective] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    setLoading(true);
    setSuggestions([]);
    const res = await fetch('/api/ai/message-suggestions', {
      method: 'POST',
      body: JSON.stringify({ objective }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.success) setSuggestions(data.suggestions);
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight="bold">
          🎯 AI Message Suggestions
        </Typography>
        <TextField
          fullWidth
          label="Campaign Objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" onClick={getSuggestions}>
          Generate Messages
        </Button>

        {loading && (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Generating suggestions...
            </Typography>
          </Box>
        )}

        <List>
          {suggestions.map((text, i) => (
            <ListItem key={i}>
              <Paper elevation={1} sx={{ px: 2, py: 1, width: '100%' }}>
                {text}
              </Paper>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Container>
  );
}
