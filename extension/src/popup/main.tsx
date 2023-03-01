import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './popup.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0077B6'
    }
  }
});

export default function Main() {

  const sampleNotes = [
    {
        title: "Note 1",
        text: "This is a fun note"
    },
    {
        title: "Note 1",
        text: "This is a fun note"
    },
    {
        title: "Note 1",
        text: "This is a fun note"
    }
]

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className="Login">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src='NoteworthyLogoFull.png' alt="Noteworthy" width="100%" height="100%" />
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <>
                {sampleNotes.map((note) => {
                    {note.text}
                })}
            </>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}