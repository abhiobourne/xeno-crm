'use client';

import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import Link from 'next/link';

const tools = [
  {
    name: '🎯 Message Suggestions',
    route: '/ai-tools/message-suggestions',
    description: 'Generate campaign messages from an objective.',
  },
  {
    name: '📊 Campaign Summary',
    route: '/ai-tools/summary',
    description: 'Summarize campaign stats into readable insights.',
  },
  {
    name: '🧠 Segment Rule Builder',
    route: '/ai-tools/segment-builder',
    description: 'Convert natural language into segment rules.',
  },
  {
    name: '🕒 Smart Scheduling',
    route: '/ai-tools/schedule-suggestion',
    description: 'Recommend best time to send campaigns.',
  },
  {
    name: '👯 Lookalike Generator',
    route: '/ai-tools/lookalike',
    description: 'Find similar users based on top audience traits.',
  },
  {
    name: '🏷️ Auto-tag Campaigns',
    route: '/ai-tools/auto-tagging',
    description: 'Label campaigns based on content and audience.',
  },
];

export default function AIToolsDashboard() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🧠 AI Tools Dashboard
      </Typography>
      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.name} sx={{ display: 'flex' }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  {tool.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tool.description}
                </Typography>
              </Box>
              <Box mt={3} textAlign="right">
                <Button variant="contained" component={Link} href={tool.route}>
                  Open Tool
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
