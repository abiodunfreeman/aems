import Nav from '../../components/Nav';
import axios from 'axios';
import Router from 'next/router';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from '@mui/material';
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

  const loginAuto = async e => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const form = document.querySelector('form');

    const userData = { username, password };

    const res = await axios.post(`${SERVER_URL}/user/login`, userData);
    console.log(res.data.user);
    if (res.data.user) {
      setUser(res.data.user);
      console.log('redirect');
      Router.push({
        pathname: '/user/[id]',
        query: { id: res.data.user._id },
      });
      // Router.push(`/user/[id]?id=${res.data.user._id}`);
    }
  };
  const login = async status => {
    // const res = await axios.get(SERVER_URL);
    // console.log(res.data);
    // return;
    if (status === 'admin') {
      const loginUrl = `${SERVER_URL}/user/login`;
      const userData = { username: 'jayshonk', password: 'aptiv' };
      try {
        const res = await axios.post(loginUrl, userData);
        setUser(res.data.user);
        console.log(res.data);
        Router.push({
          pathname: '/user/[id]',
          query: { id: res.data.user._id },
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      const userData = { username: 'guest', password: 'guest' };
      const res = await axios.post(`${SERVER_URL}/user/login`, userData);

      if (res.data.user) {
        setUser(res.data.user);

        Router.push({
          pathname: '/user/[id]',
          query: { id: res.data.user._id },
        });
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
                <Button type="submit" variant="outlined" fullWidth>
                  login
                </Button>
                <div className="flex gap-3">
                  <Button variant="outlined" onClick={() => login('default')}>
                    <p className="login-link">login as guest</p>
                  </Button>
                  <Button variant="outlined" onClick={() => login('admin')}>
                    <p className="login-link"> login as ADMIN</p>
                  </Button>
                </div>
              </CardActions>
            </form>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Login;
