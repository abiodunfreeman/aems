import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ItemCard from '../../components/ItemCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      light: '#f25633e2',
      main: '#f84018',
    },
  },
});
export default function All() {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [cardJSX, setCardJSX] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const getAllCategories = async () => {
    const res = await axios.get(`${SERVER_URL}/category/all`);
    setCategoryData(res.data);
    // console.log(res.data);
  };
  const getAllUsers = async () => {
    const res = await axios.get(`${SERVER_URL}/user/all`);
    setAllUsers(res.data);
  };

  const getUser = async () => {
    const res = await axios.get(`${SERVER_URL}`);
    setUser(res.data.user);
  };
  const fetchItems = async () => {
    const res = await axios.get(`${SERVER_URL}/item/all`);
    setItems(res.data);
    setAllItems(res.data);
  };

  const handleDeleteItem = async (id, setChildErrMsg, setChildSuccessMsg) => {
    if (user && user.status === 'admin') {
      const res = await axios.delete(`${SERVER_URL}/item/delete/${id}`);
      // fetchItems();
      setTimeout(fetchItems, 0);
      setChildSuccessMsg(`${res.data.deletedItem.model} deleted successfully`);
      setChildErrMsg('');
      console.log(res.data);
    } else {
      setChildErrMsg('insufficient rights, please see an admin');
      setChildSuccessMsg('');
    }
  };
  const handleFilterChange = e => {
    console.log(e.target.value);

    setItems(prevItems => {
      return allItems.filter(item =>
        item.category.name.includes(e.target.value)
      );
    });
  };

  useEffect(() => {
    getUser();
    getAllUsers();
    getAllCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    const cards = items.map(item => {
      return (
        <ItemCard
          item={item}
          users={allUsers}
          categoryData={categoryData}
          key={item._id}
          deleteItem={handleDeleteItem}
          fetchItems={fetchItems}
          setErrMsg={setErrMsg}
          setSuccessMsg={setSuccessMsg}
        />
      );
    });
    setCardJSX(cards);
  }, [items]);

  return (
    <ThemeProvider theme={theme}>
      <div id="items-all-container">
        <Nav />
        <main>
          <div className="flex justify-center p-3 gap-4 flex-wrap">
            {user && (
              <Link href="/item/new">
                <Button variant="outlined">Create a new Item</Button>
              </Link>
            )}
            <Link href="/item/instance">
              <Button variant="outlined">View Item Instances</Button>
            </Link>
            <TextField
              type="text"
              placeholder="Category name..."
              label="Filter based on category"
              name="filter-category"
              variant="standard"
              id={`filter-text`}
              onChange={handleFilterChange}
            />
          </div>
          <h1 className="text-center text-xl  uppercase font-bold text-green-400">
            {successMsg}
          </h1>
          <h1 className="text-center text-xl  uppercase font-bold">{errMsg}</h1>
          <section id="items-jsx-container">{cardJSX}</section>
        </main>
      </div>
    </ThemeProvider>
  );
}
