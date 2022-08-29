import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { useUserContext } from '../../context/user';

export default function AllUsers() {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const CLIENT_URL = 'https://aems.vercel.app';

  const [user, setUser] = useUserContext();
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersJSX, setUsersJSX] = useState([]);
  function returnUserJSX(users) {
    const userJSX = users.map(u => {
      return (
        <div
          key={u._id}
          className="border border-black p-2 flex flex-col items-center justify-center gap-3 w-60 h-60 shadow-lg bg-darkgray text-white  rounded-lg"
        >
          <h1 className=" font-semibold text-3xl">{u.username}</h1>

          <Link href={`/user/[id]?id=${u._id}`}>
            <Button variant="contained">View Profile</Button>
          </Link>
          <Button
            variant="outlined"
            onClick={() => deleteUser(u._id)}
            color="error"
          >
            Delete User
          </Button>
        </div>
      );
    });
    return userJSX;
  }
  const deleteUser = async id => {
    console.log(user.status);
    if (user.status !== 'admin') {
      setErrMsg('please see an admin to delete a user');
      setSuccessMsg(false);
      return;
    }
    const res = await axios.delete(`${SERVER_URL}/user/${id}/delete`);

    getUsers();
    if (res.data.success === true) console.log(res.data);
    setSuccessMsg(
      <h3 className="text-green-500 text-lg">
        user{' '}
        <span className="text-red-500">
          {res.data.deletedUser.username.toUpperCase()}
        </span>{' '}
        deleted successfully
      </h3>
    );
    setErrMsg('');
  };
  const getUsers = async () => {
    const res = await axios.get(`${SERVER_URL}/user/all`);

    setUsersJSX(returnUserJSX(res.data));
    setUsers(res.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  function handleFilterUsers(e) {
    const userSearchValue = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
      user.username.includes(userSearchValue)
    );
    setUsersJSX(returnUserJSX(filteredUsers));
  }
  return (
    <div className="min-h-screen flex flex-col w-screen max-w-screen">
      <Nav />
      <div className="flex flex-col items-center p-2">
        <TextField
          className="self-center mb-4"
          id="filter-user-input"
          variant="standard"
          placeholder="enter name"
          label="filter by username"
          onChange={handleFilterUsers}
        />
        <h1 className="text-xl text-red-500 font-semibold">{errMsg}</h1>
        {successMsg}
      </div>
      <div className=" flex gap-4 flex-wrap p-4 self-center  justify-evenly w-full ">
        {usersJSX}
      </div>
    </div>
  );
}
