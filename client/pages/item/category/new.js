import { TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import Nav from '../../../components/Nav';
import { Button, Card, CardActions, CardContent } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      light: '#f25633e2',
      main: '#f84018',
    },
  },
});
export default function New() {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const [formData, setFormData] = useState();
  const [successMsg, setSuccessMsg] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const handleFormChange = () => {
    const name = document.getElementById('name');
    setFormData(name.value);
  };
  const handleClick = async e => {
    e.preventDefault();
    // console.log(e);
    console.log(formData);
    const res = await axios.post(`${SERVER_URL}/category/new`, {
      name: formData,
    });

    if (!res.data.success) {
      setErrMsg(
        <h3 className="text-center text-red-500">
          <span className="font-semibold underline">{formData}</span> category
          already exist
        </h3>
      );
      setSuccessMsg('');
      return;
    }

    setSuccessMsg(
      <h3 className="text-center text-green-500">
        <span className="font-semibold underline">
          {res.data.newCategory.name}
        </span>{' '}
        successfully created`
      </h3>
    );
    setErrMsg('');
    const form = document.querySelector('form');
    form.reset();
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="page-container ">
        <Nav />

        <div className="m-auto">
          <h1 className="text-center text-xl font-bold text-white">
            Create a New Category
          </h1>
          <Card
            raised={true}
            className="m-4 p-4 self-center  max-w-screen-sm "
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: '4px',
            }}
          >
            {errMsg}
            {successMsg}
            <form onSubmit={e => handleClick(e)} className=" flex flex-col ">
              <CardContent className=" flex flex-col">
                <TextField
                  variant="standard"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="category name"
                  className="border border-black"
                  onChange={() => handleFormChange()}
                />
              </CardContent>
              <CardActions className="flex justify-center">
                {' '}
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={e => handleClick(e)}
                >
                  Add New Category
                </Button>
              </CardActions>
            </form>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}
