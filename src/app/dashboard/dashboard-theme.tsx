import { PaletteMode } from '@mui/material';
import { grey } from '@mui/material/colors';

// custom palette
declare module '@mui/material/styles' {
  interface Palette {
    dashboardDrawer?: Palette['primary'];
  }
  interface PaletteOptions {
    dashboardDrawer?: PaletteOptions['primary'];
  }
}

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // light mode
        background: {
          default: grey[300]
        },
        primary: {
          main: '#007047',
        },
        dashboardDrawer: {
          main: '#003B25'
        }
      } : {
        //dark mode
        background: {
          default: grey[900]
        },
        primary: {
          main: '#003B25'
        },
        dashboardDrawer: {
          main: '#0f0f0f'
        }
      })
  },
});
