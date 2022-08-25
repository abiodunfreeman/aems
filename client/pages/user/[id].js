import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import { Button, TextField } from '@mui/material';
import Link from 'next/link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InstanceCard from '../components/InstanceCard';
import { useUserContext } from '../../context/user';
const theme = createTheme({
  palette: {
    primary: {
      light: '#f25633e2',
      main: '#f84018',
    },
  },
});
const OneUser = () => {
  const SERVER_URL = 'https://aems-server.herokuapp.com';

  const [user, setUser] = useUserContext();
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState({});
  const [msg, setMsg] = useState(false);
  const [userId, setUserId] = useState();
  const [userItems, setUserItems] = useState([]);
  const [added, setAdded] = useState(false);
  const [allUserItems, setAllUserItems] = useState([]);
  const [userItemsJSX, setUserItemsJSX] = useState([]);
  const [totalItemValue, setTotalItemValue] = useState(0);
  const [options, setOptions] = useState([]);
  const fetchOptions = async () => {
    const res = await axios.get(`${SERVER_URL}/user/all`);
    const options = res.data.map(user => {
      return { label: user.username, id: user._id };
    });

    setOptions(options);
  };
  const fetchUserData = async () => {
    // console.log(userId);
    const res = await axios.get(`${SERVER_URL}/user/${userId}`);
    setUserData(res.data.oneUser);
  };
  const fetchUserItems = async () => {
    const res = await axios.get(`${SERVER_URL}/user/item/${userId}`);
    // console.log(res.data);
    setUserItems(res.data.userItems);
    setAllUserItems(res.data.userItems);
  };
  const deleteItemInstance = async (itemId, price, setErrMsg, setMsg) => {
    if (!user) {
      setMsg('');
      setErrMsg('please log in');
      return;
    } else if (user.status !== 'admin') {
      setMsg('');
      setErrMsg('only admins can delete items');

      return;
    }
    const res = await axios.delete(`${SERVER_URL}/iteminstance/${itemId}`);

    setTotalItemValue(prevVal => prevVal - price);
    fetchUserItems();
  };
  useEffect(() => {
    setUserId(id);
    fetchOptions();
  }, []);
  useEffect(() => {
    fetchUserData();
    fetchUserItems();
  }, [userId]);
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  useEffect(() => {
    // console.log(allUserItems);
    const jsx = userItems.map(instance => {
      if (instance.item === null) {
        deleteItemInstance(instance._id);
        return;
      }
      if (!added) {
        setTotalItemValue(prevValue => prevValue + instance.item.price);
        setAdded(true);
      }
      return (
        <InstanceCard
          key={instance._id}
          instance={instance}
          deleteInstance={deleteItemInstance}
          fetchUserItems={fetchUserItems}
          options={options}
          user={user}
        />
      );
    });
    setUserItemsJSX(jsx);
  }, [userItems]);
  const changeUserStatus = async () => {
    const res = await axios.put(`${SERVER_URL}/user/${userId}`, {
      status: userData.status,
    });
    setMsg(
      <p className="user-msg font-semibold text-green-500">
        relog for status update
      </p>
    );
    setUserData(res.data.user);
  };
  function handleFilterInstances(e) {
    setUserItems(
      allUserItems.filter(instance => {
        const modelName = instance.item.model.toLowerCase();
        return modelName.includes(e.target.value.toLowerCase());
      })
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <div className=" bg-darkgray min-h-screen flex flex-col max-w-screen ">
        <Nav />
        <div className="relative bg-white max-w-full text-lg flex gap-6 justify-around flex-wrap items-center p-8   w-full ">
          <div className="flex flex-col gap-1  items-center w-40">
            <h1>
              User :{' '}
              <span className="font-bold uppercase">{userData.username}</span>
            </h1>
            <h1>
              Status:{' '}
              <span className="font-bold uppercase">{userData.status}</span>
            </h1>
            <div className="flex flex-col">
              <Button onClick={() => changeUserStatus()} variant="outlined">
                Change Status
              </Button>

              <Link href="/user/all">
                <Button>All Users</Button>
              </Link>
            </div>
          </div>
          <div>
            <h1 className="text-center">
              Total Value of Items - {formatter.format(totalItemValue)}
            </h1>
            <h1>Number of Items: {userItemsJSX && userItemsJSX.length}</h1>

            <TextField
              className=""
              id="filter-instance-input"
              variant="standard"
              placeholder="enter model name"
              label="filter by model name"
              onChange={handleFilterInstances}
            />
          </div>
          {msg}
        </div>

        <div className="  flex p-3 flex-wrap gap-6  justify-center">
          {userItemsJSX && userItemsJSX.length > 0 ? (
            userItemsJSX
          ) : (
            <div className=" p-4 flex flex-col">
              <p className="text-white text-4xl font-semibold">
                no items to show
              </p>
              <Link href="/item/all">
                <Button>Add Items</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};
export default OneUser;
