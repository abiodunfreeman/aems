import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
const OneItem = () => {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState({});
  const [idState, setIdState] = useState();
  const getItem = async () => {
    const x = id;
    console.log(x + ' ID');
    console.log(idState + ' state');
    const res = await axios.get(`${SERVER_URL}/item/${idState}`);
    console.log(res);
    if (res.data.success === true) setItem(res.data.item);
    if (res.data.success === false) setItem(undefined);
  };
  useEffect(() => {
    console.log(`setting state id - ${id}`);
    setIdState(id);
  }, []);
  useEffect(() => {
    getItem();
  }, [idState]);
  useEffect(() => {
    console.log(item);
  }, [item]);
  return (
    <div>
      <Nav />

      {item !== undefined ? (
        <div>
          {/* <h1>{item.model}</h1> */}
          {JSON.stringify(item)
            .split(',')
            .map(x => (
              <h1 key={x} className="text-blue-400 mt-3">
                {x}
              </h1>
            ))}
        </div>
      ) : (
        <h1>No Item Found with ID: {id}</h1>
      )}
    </div>
  );
};
export default OneItem;
