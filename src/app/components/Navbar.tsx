'use client'

import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          Xeno CRM
        </Typography>

        {session ? (
          <Box display="flex" alignItems="center" gap={3}>
            <Stack direction="row" spacing={2}>
              <Button onClick={() => router.push('/create-segment')}>Create Segment</Button>
              <Button onClick={() => router.push('/campaigns')}>View Campaigns</Button>
              <Button onClick={() => router.push('/ai-tools')}>AI Tools</Button>
            </Stack>

            <IconButton onClick={handleMenu} size="small">
              <Avatar src={session.user?.image || ''} alt={session.user?.name || 'User'} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => { signOut(); handleClose() }}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button variant="contained" onClick={() => signIn('google')}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
