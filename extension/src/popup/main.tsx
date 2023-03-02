import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './popup.css';
import { Typography } from '@mui/material';

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
        text: "This is a fun note",
        id: 1
    },
    {
        title: "Note 2",
        text: "This is a fun note",
        id: 2
    },
    {
        title: "Note 3",
        text: "This is a fun note",
        id: 3
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
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: "80%"}}>
            <>
                {sampleNotes.map((note) => {
                    return (
                        <Container key={note.id} sx={{width: "100%", backgroundColor: "#F3E779", marginTop: "16px" }}>
                        <Typography variant='h3'>{note.title}</Typography>
                        </Container>
                    );
                })}
            </>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}