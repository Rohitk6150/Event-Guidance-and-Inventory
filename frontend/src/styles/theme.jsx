import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
            light: '#757de8',
            dark: '#002984',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162',
            contrastText: '#fff',
        },
        background: {
            default: '#f0f2f5',
            paper: '#fff',
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
        },
        success: {
            main: '#4caf50',
        },
        warning: {
            main: '#ff9800',
        },
        error: {
            main: '#f44336',
        },
        action: {
            active: 'rgba(0, 0, 0, 0.54)',
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(0, 0, 0, 0.08)',
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)',
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            marginBottom: '1rem',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            marginBottom: '0.8rem',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            marginBottom: '0.6rem',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            marginBottom: '0.4rem',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            marginBottom: '0.2rem',
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.6)',
            marginBottom: '0.5rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                },
            },
        },
    },
});

export default theme;