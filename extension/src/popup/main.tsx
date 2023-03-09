import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './popup.css';
import { Button, Grid, Typography } from '@mui/material';
import NoteService from '../services/note.service.js';
import { useEffect, useState } from 'react';
import { getChromeItem, getUrl, removeChromeItem, setChromeItem } from '../contentScript/contentScript';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0077B6'
    }
  }
});

interface SampleNote {
  id: string,
  title: string,
}

export default function Main() {

  const [notes, setNotes] = useState<SampleNote[]>();

  async function getNotes() {
    var userId = await getChromeItem("user_id");
    var url = await getUrl("url");
    const constraints = "" + userId + ",https://www.google.com/";
    const info = {"resource": "user_id,url", "constraint": constraints}
    try {
        const response = await NoteService.getAll(info);
        let list: any = [];
        console.log(response);
        response.data.results.forEach(function(note) {
            const data = {
                id: note.id,
                title: note.title,
                content: note.content,
            }
            list = list.push(data);
        });
        console.log(response);
        setNotes(list);
    } catch(error){
        if(error.response?.status){
            console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
        } else {
            console.log(error);
        }
    }
}

  useEffect(() => {
    console.log("Attempting to get notes");
    getNotes();
  }, []);


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

async function handleLogout () {
  localStorage.setItem("authenticated", "false");
  await removeChromeItem("user_id");
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
                {notes != null ?  notes.map((note) => {
                    return (
                        <Container key={note.id} sx={{ width: "90%", height: '300px', backgroundColor: "#F3E779", margin: "8px" }} onClick={handleNoteClick}>
                          <Typography variant='h5'>{note.title}</Typography>
                        </Container>
                    );
                }) : 
                <Container sx={{ width: "90%", backgroundColor: "#F3E779", margin: "8px" }}>
                  <Typography>No notes exist on this page. Right click and select the extension menu item to create your first note</Typography>
                </Container>}
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