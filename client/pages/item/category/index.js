import Nav from '../../../components/Nav';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { useUserContext } from '../../../context/user';
export default function Home() {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const [user, setUser] = useUserContext();
  const [errMsg, setErrMsg] = useState('');
  const [succesMsg, setSuccesMsg] = useState('');
  const [data, setData] = useState([]);
  const [catJSON, setCatJSON] = useState([]);
  const getAllCategories = async () => {
    const res = await axios.get(`${SERVER_URL}/category/all`);
    const jsxData = res.data.map(x => {
      return (
        <div key={x.name} className="border border-black p-3 flex flex-col ">
          <Link href={`/item/category/${x.name}`}>
            <h1 className="text-3xl text-center">{x.name}</h1>
          </Link>

          <Button variant="outlined" onClick={() => deleteCategoryClick(x._id)}>
            Delete
          </Button>
        </div>
      );
    });
    setData(jsxData);
    setCatJSON(res.data);
  };
  const deleteCategoryClick = async id => {
    console.log(user.status);
    // console.log(catJSON);
    const cat = catJSON.filter(category => category._id === id)[0];
    // console.log(cat);
    if (!user) {
      setErrMsg('please log in to delete a category');
      return;
    } else if (user.status !== 'admin') {
      setErrMsg('insufficient rights, please seee an admin');
      return;
    }
    const res = await axios.delete(`${SERVER_URL}/category/${id}`);
    console.log(res.data);
    getAllCategories();
    setSuccesMsg(
      <h2 className="font-semibold text-green-500 text-xl ">
        category{' '}
        <span className="text-red-500">{res.data.deletedCategory.name}</span>{' '}
        deleted successfully
      </h2>
    );
    setErrMsg('');
    // console.log(res.data);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div id="category-index">
      <Nav />
      <div className="flex flex-col items-center justify-center p-3">
        <h1 className="font-bold text-3xl">
          Deleting a category will also delete all items and instances of items
          with that category.
        </h1>

        <Link href="/item/category/new">
          <Button variant="outlined" className="m-4">
            Create a New Category
          </Button>
        </Link>
        <h1 className="text-red-500 font-semibold text-xl">{errMsg}</h1>
        {succesMsg}
      </div>

      <div className="flex gap-8 flex-wrap">{data}</div>
    </div>
  );
}
