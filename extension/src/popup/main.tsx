import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './popup.css';
import { Button, Grid, Typography } from '@mui/material';

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
        title: "This is a really long title",
        text: "This is a fun note",
        id: 1,
        x: 100,
        y: 400,
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
    },
    {
      title: "Note 1",
      text: "This is a fun note",
      id: 4
    },
    {
        title: "Note 2",
        text: "This is a fun note",
        id: 5
    },
    {
        title: "Note 3",
        text: "This is a fun note",
        id: 6
    },
    {
      title: "Note 1",
      text: "This is a fun note",
      id: 7
    },
    {
        title: "Note 2",
        text: "This is a fun note",
        id: 8
    },
    {
        title: "Note 3",
        text: "This is a fun note",
        id: 9
    },
]

const handleLogout = () => {
  localStorage.setItem("authenticated", "false");
  window.close();
};

const handleNoteClick = () => {
  window.scrollTo({
    top: 500,
    left: 100,
    behavior: 'smooth'
  });
};

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs"className="Login" sx={{ height: '500px' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img src='NoteworthyLogoFull.png' alt="Noteworthy" width="100%" height="100%" />
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: "80%", maxHeight: '300px', overflow: 'scroll', border: "2px solid black"}}>
            <>
                {sampleNotes.map((note) => {
                    return (
                        <Container key={note.id} sx={{ width: "90%", backgroundColor: "#F3E779", margin: "8px" }} onClick={handleNoteClick}>
                          <Typography variant='h5'>{note.title}</Typography>
                        </Container>
                    );
                })}
            </>
          </Box>
          <Grid container spacing={2} height="50px" marginBottom="24px" marginTop="16px">
            <Grid item xs={6}>
              <Button variant="contained" fullWidth onClick={() => window.open('http://localhost:3000/settings', "_blank")}>Settings</Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained"  fullWidth onClick={handleLogout}>Logout</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}