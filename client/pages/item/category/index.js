import Nav from '../../components/Nav';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { useUserContext } from '../../../context/user';
export default function Home() {
  const [user, setUser] = useUserContext();
  const [errMsg, setErrMsg] = useState('');
  const [succesMsg, setSuccesMsg] = useState('');
  const [data, setData] = useState([]);
  const [catJSON, setCatJSON] = useState([]);
  const getAllCategories = async () => {
    const res = await axios.get(`http://localhost:5000/category/all`);
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
    const res = await axios.delete(`http://localhost:5000/category/${id}`);
    console.log(res.data);
    getAllCategories();
    setSuccesMsg(
      <h2>Category ${res.data.deletedCategory.name} deleted successfully</h2>
    );
    // console.log(res.data);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div id="category-index">
      <Nav />
      <div className="flex flex-col items-center justify-center p-3">
        <h1>{errMsg}</h1>
        {succesMsg}
        <Link href="/item/category/new">
          <Button variant="outlined">Create a New Category</Button>
        </Link>
        <h1 className="font-bold text-4xl">
          Deleting a category will also delete all items and instances of items
          with that category.
        </h1>
      </div>

      <div className="flex gap-8 flex-wrap">{data}</div>
    </div>
  );
}
