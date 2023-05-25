'use client';
import * as React from 'react';
import { useState } from 'react';
import {
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
  PaletteMode,
  CssBaseline,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import MenuList from './menulist';
import UserMenu from './user-menu';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import DarkModeSwitch from './darkmode-switch';
import { getDesignTokens } from './dashboard-theme';
import BasicPageLoad from './basic-page-load';
import { Provider } from 'react-redux';
import { store } from '@/redux-store/store';
import NewAuthProvider from './new-auth-provider';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

type DashboardLayoutProps = {
  children: React.ReactNode,
};

export default function Menu({ children }: DashboardLayoutProps) {
  return (
    <Provider store={store}>
      <NewAuthProvider>
        <MenuBody>
          {children}
        </MenuBody>
      </NewAuthProvider>
    </Provider>
  );
}

function MenuBody({ children }: DashboardLayoutProps) {
  const prefersDarkMode: PaletteMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  const [darkMode, setDarkMode] = useState<PaletteMode>(prefersDarkMode);
  const theme = React.useMemo(() => createTheme(getDesignTokens(darkMode)), [darkMode]);
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const list = () => (
    <Box
      sx={{ width: '100%', color: 'white' }}
      role='presentation'
    >
      <MenuList />
    </Box>
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <AppBar position='fixed' elevation={0} enableColorOnDark color='primary' open={open}>
            <Toolbar>
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aira-label='menu'
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1, color: 'white' }}>
                Litoka open source stream tools
              </Typography>
              <DarkModeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
              <UserMenu />
            </Toolbar>
          </AppBar>
          <Drawer anchor='left' variant='persistent' open={open} sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              backgroundColor: theme.palette.dashboardDrawer?.main,
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 0
            },
          }}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
                {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </DrawerHeader>
            {list()}
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            <React.Suspense fallback={<BasicPageLoad />}>
              {children}
            </React.Suspense>
          </Main>
        </Box>
      </ThemeProvider>
    </>
  );
}
