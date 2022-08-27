import Nav from '../../components/Nav';
import axios from 'axios';
import Router from 'next/router';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { useUserContext } from '../../context/user';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      light: '#f25633e2',
      main: '#f84018',
    },
  },
});
function Login() {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const CLIENT_URL = 'https://aems.vercel.app';
  axios.defaults.withCredentials = true;

  const [user, setUser] = useUserContext();
  const [waiting, setWaiting] = useState(false);
  const loginAuto = async e => {
    e.preventDefault();
    setWaiting(true);
    try {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const userData = { username, password };

      const res = await axios.post(`${SERVER_URL}/user/login`, userData, {
        withCredentials: true,
      });

      if (res.data && res.data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            _id: res.data.user._id,
            username: res.data.user.username,
            status: res.data.user.status,
          })
        );
        setUser(res.data.user);
        setWaiting(false);
        Router.push({
          pathname: '/user/[id]',
          query: { id: res.data.user._id },
        });
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const login = async status => {
    setWaiting(true);
    const loginUrl = `${SERVER_URL}/user/login`;

    if (status === 'admin') {
      const userData = { username: 'jayshonk', password: 'aptiv' };
      try {
        const res = await axios.post(loginUrl, userData);
        if (res.data && res.data.user) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              _id: res.data.user._id,
              username: res.data.user.username,
              status: res.data.user.status,
            })
          );
          setWaiting(false);
          setUser(res.data.user);
          Router.push({
            pathname: '/user/[id]',
            query: { id: res.data.user._id },
          });
        } else {
          console.log(res);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      const userData = { username: 'guest', password: 'guest' };
      try {
        const res = await axios.post(loginUrl, userData);

        if (res.data && res.data.user) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              _id: res.data.user._id,
              username: res.data.user.username,
              status: res.data.user.status,
            })
          );
          setWaiting(false);
          setUser(res.data.user);

          Router.push({
            pathname: '/user/[id]',
            query: { id: res.data.user._id },
          });
        } else {
          console.log(res);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="page-container">
        <Nav />
        <div className="m-auto">
          <Card raised={true} className="m-4 p-4 self-center  max-w-screen-sm ">
            <form className=" flex flex-col " onSubmit={e => loginAuto(e)}>
              <CardContent className=" flex flex-col">
                <h1 className="text-center font-bold pb-1">login</h1>
                <TextField
                  type="string"
                  placeholder="enter a username"
                  label="username"
                  name="username"
                  variant="standard"
                  id="username"
                  required
                />
                <TextField
                  type="password"
                  placeholder="enter a password"
                  label="password"
                  name="password"
                  variant="standard"
                  id="password"
                  required
                />
              </CardContent>
              <CardActions className="flex flex-col items-center gap-3">
                {!waiting && (
                  <Button type="submit" variant="outlined" fullWidth>
                    login
                  </Button>
                )}
                {!waiting && (
                  <div className="flex gap-3">
                    <Button variant="outlined" onClick={() => login('default')}>
                      <p className="login-link">login as guest</p>
                    </Button>
                    <Button variant="outlined" onClick={() => login('admin')}>
                      <p className="login-link"> login as ADMIN</p>
                    </Button>
                  </div>
                )}
                {waiting && (
                  <Box
                    sx={{
                      display: 'flex',

                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </CardActions>
            </form>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Login;
