import Nav from '../../../components/Nav';
import axios from 'axios';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import InstanceCard from '../../../components/InstanceCard';
import { useUserContext } from '../../../context/user';

export default function Home() {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const [statusFilter, setStatusFilter] = useState('None');
  const [user, setUser] = useUserContext();
  const [instanceJSX, setInstanceJSX] = useState([]);
  const [itemInstances, setItemInstances] = useState([]);
  const [allInstances, setAllInstances] = useState([]);
  const [options, setOptions] = useState([]);
  const fetchOptions = async () => {
    const res = await axios.get(`${SERVER_URL}/user/all`);
    const options = res.data.map(user => {
      return { label: user.username, id: user._id };
    });
    console.log(options);
    setOptions(options);
  };
  const fetchItemInstances = async status => {
    const res = await axios.get(`${SERVER_URL}/iteminstance/all`);
    const instancesData = res.data.itemInstances;
    setAllInstances(instancesData);
    // if status is undefined, sets it to statusFilter which defaults to 'None'
    status = status ? status : statusFilter;
    // if status is set returns instance with matching status else returns all
    if (status && status != 'None') {
      console.log('status is not none - ' + status);
      setItemInstances(prevInstances => {
        return instancesData.filter(instance => {
          return instance.status == status;
        });
      });
      return;
    }

    setItemInstances(instancesData);
  };
  const deleteItemInstance = async (itemId, price, setErrMsg, setMsg) => {
    if (!user) {
      setMsg('');
      setErrMsg('please log in to delete an instance');
      return;
    } else if (user.status !== 'admin') {
      setMsg('');
      setErrMsg('only admins can delete items');
      return;
    }
    const res = await axios.delete(`${SERVER_URL}/iteminstance/${itemId}`);

    fetchItemInstances();
  };
  const handleFilterInstances = e => {
    const filterValue = e.target.value.toLowerCase();
    const otherInput = document.getElementById('filter-brand-input');
    otherInput.value = '';

    if (statusFilter != 'None') {
      setItemInstances(prevInstances => {
        const statusFilteredInstances = allInstances.filter(
          instance => instance.status == statusFilter
        );
        const filteredInstances = statusFilteredInstances.filter(instance => {
          const modelName = instance.item.model.toLowerCase();
          return modelName.includes(filterValue);
        });
        return filteredInstances;
      });
      return;
    }
    setItemInstances(prevInstances => {
      const filteredInstances = allInstances.filter(instance => {
        const modelName = instance.item.model.toLowerCase();
        return modelName.includes(filterValue);
      });
      return filteredInstances;
    });
  };
  const handleFilterBrand = e => {
    const otherInput = document.getElementById('filter-instance-input');
    otherInput.value = '';
    const filterValue = e.target.value.toLowerCase();
    if (statusFilter != 'None') {
      setItemInstances(prevInstances => {
        const statusFilteredInstances = allInstances.filter(
          instance => instance.status == statusFilter
        );
        const filteredInstances = statusFilteredInstances.filter(instance => {
          const modelName = instance.item.model.toLowerCase();
          return modelName.includes(filterValue);
        });
        return filteredInstances;
      });
      return;
    }
    setItemInstances(prevInstances => {
      const filteredInstances = allInstances.filter(instance => {
        const modelName = instance.item.brand.toLowerCase();
        return modelName.includes(filterValue);
      });
      return filteredInstances;
    });
  };
  useEffect(() => {
    fetchItemInstances();
    fetchOptions();
  }, []);
  useEffect(() => {
    setInstanceJSX(
      itemInstances.map(instance => {
        return (
          <InstanceCard
            key={instance._id}
            instance={instance}
            deleteInstance={deleteItemInstance}
            fetchUserItems={fetchItemInstances}
            options={options}
            user={user}
            seeOwner={true}
          />
        );
      })
    );
  }, [itemInstances]);
  const handleStatusChange = e => {
    // i want to change the status
    // update instances to reflect changes
    // keep same statusFilter active
    // newly

    if (e.target.value == 'None') {
      setItemInstances(allInstances);
      return;
    }
    setStatusFilter(e.target.value);
    fetchItemInstances(e.target.value);
  };
  return (
    <div className="bg-darkgray min-h-screen flex flex-col  w-screen max-w-screen">
      <Nav />
      <div className="gap-6 bg-white w-screen max-w-screen p-8 mb-4 flex justify-center flex-col sm:flex-row items-center ">
        <FormControl variant="filled" sx={{ width: '200px' }}>
          <InputLabel id="status-select-label">Filter by Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={statusFilter}
            label="status"
            onChange={handleStatusChange}
          >
            <MenuItem value={'None'}>None</MenuItem>
            <MenuItem value={'Available'}>Available</MenuItem>
            <MenuItem value={'Loaned'}>Loaned</MenuItem>
            <MenuItem value={'Maintenance'}>Maintenance</MenuItem>
            <MenuItem value={'Reserved'}>Reserved</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className=""
          id="filter-instance-input"
          variant="standard"
          placeholder="enter model name"
          label="filter by model"
          onChange={handleFilterInstances}
        />
        <TextField
          className=""
          id="filter-brand-input"
          variant="standard"
          placeholder="enter brand name"
          label="filter by brand"
          onChange={handleFilterBrand}
        />
      </div>

      <div className=" flex flex-wrap p-8 gap-8 justify-center w-screen max-w-screen">
        {instanceJSX}
      </div>
    </div>
  );
}
