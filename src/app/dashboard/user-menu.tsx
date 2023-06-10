'use client';
import * as React from 'react';
import { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-store/store';

export default function UserMenu() {

  const authState = useSelector((state: RootState) => state.auth);

  const theme = useTheme();

  const [userOptionsMenu, setUserOptionsMenu] = useState<null | HTMLElement>(null);

  const handleOpenUserOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserOptionsMenu(event.currentTarget);
  };

  const handleCloseUserOptionsMenu = (identifier: string) => {
    // handling click also functions as a menu close
    // TODO: see if doing this is possible without manually passing a string
    switch (identifier) {
      case 'settings':
        console.log('todo');
        break;
      case 'logout':
        localStorage.clear();
        window.location.href = '/';
    }
    setUserOptionsMenu(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title='Open Settings'>
        <Card variant='outlined' sx={{
          backgroundColor: theme.palette.primary.main,
          borderColor: '#00A86B',
          paddingX: 1,
          paddingY: 0.5,
          borderRadius: 8
        }}>
          <CardActionArea onClick={handleOpenUserOptionsMenu}>
            <Stack direction='row' spacing={2} sx={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography sx={{ color: 'white', paddingLeft: 1 }}>
                {getOrUndefined(authState.userName)}
              </Typography>
              <Avatar src={getOrUndefined(authState.profilePicture)} />
            </Stack>
          </CardActionArea>
        </Card>
      </Tooltip>
      <Menu
        id='user-menu-appbar'
        keepMounted
        anchorEl={userOptionsMenu}
        open={Boolean(userOptionsMenu)}
        onClose={handleCloseUserOptionsMenu}
      >
        <MenuItem key='settings' onClick={() => handleCloseUserOptionsMenu('settings')}>
          <ListItemIcon><Settings fontSize='small' /></ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem key='logout' onClick={() => handleCloseUserOptionsMenu('logout')}>
          <ListItemIcon><Logout fontSize='small' /></ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );

}

function getOrUndefined(val: string | null): string | undefined {
  if (val === null) return undefined;
  return val;
}
