import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { Button } from '@mui/material';
export default function All() {
  const [user, setUser] = useState({});
  const getUser = async () => {
    const res = await axios.get('http://localhost:5000');
    console.log(res.data);
    setUser(res.data.user);
  };

  useEffect(() => {
    getUser();
  }, []);
  const [errMsg, settErrMsg] = useState('');
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/item/all');
    setItems(res.data);
    // console.log(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);
  async function handleDeleteItem(id) {
    if (user && user.status === 'admin') {
      const res = await axios.delete(`http://localhost:5000/item/delete/${id}`);
      // fetchItems();
      setTimeout(fetchItems, 0);
      console.log(res);
    } else {
      settErrMsg('insufficient rights, please see an admin');
    }
  }
  return (
    <div>
      <main>
        <h1 className="text-bold text-center text-3xl uppercase">aems</h1>
        <Nav />
        <Link href="/item/new">
          <Button variant="outlined">Create a new Item</Button>
        </Link>
        <h1>{errMsg}</h1>
        <section className="border-8 border-blue-400 flex gap-4 flex-wrap justify-evenly">
          {items.map(item => {
            const url = `http://localhost:3000/item/${item.category.name}`;
            return (
              <div className="m-8" key={item._id}>
                <Link href={url}>
                  <h2 className="cursor-pointer">{item.category.name}</h2>
                </Link>

                <h2>{item.model}</h2>
                <h2>{item.Total_Value}</h2>
                <h3 className="text-bold text-2xl">
                  ${item.quantity * item.price}
                </h3>

                {user && (
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
