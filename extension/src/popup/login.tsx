import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserService from '../services/user.service.js';
import './popup.css';
import { useEffect, useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0077B6'
    }
  }
});

export default function Login() {
  const [correctPass, setCorrectPass] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => { 
    localStorage.setItem("authenticated", "false")
  }, []);

  async function handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
        const info = { email: data.get('email'), password: data.get('password')};
        const response = await UserService.login(info);
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("user_id", response.data.id); //Change to id returned when user is created
        setErrorMsg("");
        window.close();
    } catch (error) {
        if(error.response?.status){
            console.log("Error Code " + error.response.status + ": " + error.response.data.msg);
            switch(error.response.status){
                case 400:
                    setCorrectPass(false);
                    setValidEmail(false);
                    break;
                case 452:
                    setValidEmail(true);
                    setCorrectPass(false);
                    break;
                case 453:
                    setValidEmail(false);
                    setCorrectPass(true);
                    break;
                default:
            }
            setErrorMsg("Invalid Email or Password");
        } else {
            console.log(error);
            alert("Unable to login at this time.");
        }
    }
  };

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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, padding: '8px' }}
            >
              Sign In
            </Button>
            <div style={{ color: "red" }}>{errorMsg}</div>
            <Grid container>
              <Grid item xs={12}>
                <Link href="http://localhost:3000" variant="body2" target="_blank">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link href="http://localhost:3000/createaccount" variant="body2" target="_blank">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}