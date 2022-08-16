import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
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
import ItemCard from '../components/ItemCard';
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
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [cardJSX, setCardJSX] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const getAllCategories = async () => {
    const res = await axios.get(`http://localhost:5000/category/all`);
    setCategoryData(res.data);
    // console.log(res.data);
  };
  const getAllUsers = async () => {
    const res = await axios.get('http://localhost:5000/user/all');
    setAllUsers(res.data);
  };

  const getUser = async () => {
    const res = await axios.get('http://localhost:5000');
    setUser(res.data.user);
  };
  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/item/all');
    setItems(res.data);
    setAllItems(res.data);
  };
  const handleChosenUserChange = (e, id) => {
    const input = document.getElementById(`hidden-${id}`);
    setChosenUser(e.target.value);
    input.value = e.target.value;
    // console.log(input.value + ' - NEW');
  };
  const handleAssignItem = async item_id => {
    console.log(item_id);
    console.log(chosenUser);
  };
  const handleAssignForm = async (e, id) => {
    e.preventDefault();

    const input = document.getElementById(`hidden-${id}`);

    console.log(input.value);
  };
  const handleDeleteItem = async id => {
    if (user && user.status === 'admin') {
      const res = await axios.delete(`http://localhost:5000/item/delete/${id}`);
      // fetchItems();
      setTimeout(fetchItems, 0);
      setSuccessMsg(`${res.data.deletedItem.model} deleted successfully`);
    } else {
      setErrMsg('insufficient rights, please see an admin');
    }
  };
  const handleEditItem = async id => {
    console.log(id);
  };
  useEffect(() => {
    getUser();
    getAllUsers();
    getAllCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    // console.log(items);
    // console.log(user);
    // console.log(allUsers);
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
  useEffect(() => {
    // console.log(cardJSX);
  }, [cardJSX]);
  const handleFilterChange = e => {
    console.log(e.target.value);

    setItems(prevItems => {
      return allItems.filter(item =>
        item.category.name.includes(e.target.value)
      );
    });
  };
  return (
    <ThemeProvider theme={theme}>
      <div id="items-all-container">
        <Nav />
        <main>
          <div className="flex justify-center p-3 gap-4 flex-wrap">
            {user && user.status === 'admin' && (
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
