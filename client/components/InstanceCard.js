import {
  Button,
  Card,
  CardActions,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/user';

export default function InstanceCard(props) {
  const [user, setUser] = useUserContext();

  const serverURL = 'https://aems-server.herokuapp.com';
  const { instance } = props;
  const { item } = instance;
  const { brand, model, category, quantity } = item;
  const [status, setStatus] = useState(instance.status);
  const [errMsg, setErrMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [dynamicUserLink, setDynamicUserLink] = useState(
    `http://localhost:3000/user/${instance.owner._id}`
  );

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const ppu = formatter.format(item.price);
  const total = formatter.format(item.price * item.quantity);

  async function handleNewNote(e, id) {
    e.preventDefault();
    const form = document.getElementById(`form-${id}`);
    const newNoteText = document.getElementById(`new-note-${id}`).value;
    const res = await axios.post(`${serverURL}/iteminstance/notes/${id}`, {
      instanceId: id,
      note: newNoteText,
    });
    console.log(res.data);
    props.fetchUserItems();
    form.reset();
    if (res.data.success) {
      setErrMsg('');
      setMsg('note added');
    }
  }
  async function deleteNote(instanceId, note) {
    if (!user) {
      setErrMsg('must be logged in to delete a note');
      setMsg('');
      return;
    } else if (user.status !== 'admin') {
      setErrMsg('contact an admin to delete this note');
      setMsg('');
      return;
    }

    const res = await axios.put(
      `${serverURL}/iteminstance/notes/${instanceId}`,

      { instanceId, note }
    );
    props.fetchUserItems();
    setErrMsg('');
    setMsg('note deleted successfully');
    // console.log(res.data);
  }
  const handleUserChange = async () => {
    const autocomplete = document.getElementById(`combo-${instance._id}`).value;
    console.log(autocomplete);
    const owner = props.options.filter(option => {
      if (option.label === autocomplete) {
        // console.log(option);
        return option;
      }
    })[0].id;
    console.log(owner);

    const res = await axios.patch(`${serverURL}/iteminstance/${instance._id}`, {
      owner,
    });

    setMsg(`assigned to ${res.data.updatedInstance.owner.username}`);
    setErrMsg('');

    console.log(res.data);
  };
  const handleStatusChange = async e => {
    setStatus(e.target.value);
    const res = await axios.patch(
      `${serverURL}/iteminstance/status/${instance._id}`,
      { status: e.target.value }
    );
    props.fetchUserItems(undefined);
    if (res.data.success) {
      setMsg('status updated successfully');
      setErrMsg('');
    } else {
      setErrMsg('error changing status');
      setMsg('');
    }
  };
  const handleAutoCompleteChange = e => {
    const target = e.currentTarget.innerHTML;
    const id = props.options.filter(option => {
      if (option.label === target) {
        return option;
      }
    })[0].id;
    setDynamicUserLink(`http://localhost:3000/user/${id}`);
    // console.log(id);
  };
  return (
    <div className="">
      <Card sx={{ width: '300px' }}>
        <CardContent>
          <h1 className="text-center font-bold">{model}</h1>
          {props.seeOwner && <h2>Owner: {instance.owner.username}</h2>}
          <h2>Brand: {brand}</h2>
          <h3 className="">Category: {category.name}</h3>
          <ul>
            <li>Stock: {quantity}</li>
            <li>
              PPU: <span className="invisible">...</span>
              {ppu}
            </li>
          </ul>
          <p className="text-red-500 text-center">{errMsg}</p>
          <p className="text-green-500 text-center">{msg}</p>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className=" flex flex-col">
            <FormControl fullWidth variant="filled">
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={status}
                label="status"
                onChange={handleStatusChange}
              >
                <MenuItem value={'Available'}>Available</MenuItem>
                <MenuItem value={'Loaned'}>Loaned</MenuItem>
                <MenuItem value={'Maintenance'}>Maintenance</MenuItem>
                <MenuItem value={'Reserved'}>Reserved</MenuItem>
              </Select>
            </FormControl>
            {/* VIEW NOTES */}
            <Accordion sx={{ width: '250px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                notes
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
              >
                {instance.notes.length > 0 ? (
                  instance.notes.map((note, pos) => (
                    <div
                      className="instance-note"
                      key={`${instance._id}-note-${pos}`}
                    >
                      <p>{note}</p>
                      <div
                        className="delete-icon self-center"
                        onClick={() => deleteNote(instance._id, note)}
                      >
                        <DeleteForeverIcon />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>no notes</p>
                )}
              </AccordionDetails>
            </Accordion>
            {/* add notes */}
            <Accordion sx={{ width: '250px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                add notes
              </AccordionSummary>
              <AccordionDetails>
                <form
                  onSubmit={e => handleNewNote(e, instance._id)}
                  id={`form-${instance._id}`}
                >
                  <FormControl
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '15px',
                    }}
                  >
                    <TextField
                      variant="standard"
                      type="text"
                      name="new-note"
                      id={`new-note-${instance._id}`}
                      placeholder="Add a note"
                      className=""
                    />
                    <Button type="submit" variant="outlined">
                      Add note
                    </Button>
                  </FormControl>
                </form>
              </AccordionDetails>
            </Accordion>
            {/* CHANGE USER */}
            <Accordion sx={{ width: '250px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                assign to different user
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <Autocomplete
                  disablePortal
                  id={`combo-${instance._id}`}
                  options={props.options}
                  onChange={handleAutoCompleteChange}
                  renderInput={params => <TextField {...params} label="User" />}
                />
                <Button variant="outlined" onClick={handleUserChange}>
                  Change User
                </Button>
                {props.seeOwner && (
                  <Link href={dynamicUserLink}>
                    <Button>view owner</Button>
                  </Link>
                )}
              </AccordionDetails>
            </Accordion>
            <Button
              onClick={() =>
                props.deleteInstance(
                  instance._id,
                  instance.item.price,
                  setErrMsg,
                  setMsg
                )
              }
              color="error"
            >
              Delete Instance
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}
export async function getStaticProps(context) {
  return {
    props: {
      instance: {
        item: {
          category: 'prop category',
          brand: 'prop-brand',
          model: 'prop-model',
          quantity: 5,
          price: 1000,
        },
        status: 'Loaned',
        owner: {
          username: 'prop-username',
          password: 'prop-password',
          _id: '20934klsjf!',
          status: 'default',
        },
        notes: ['test note'],
      },
    }, // will be passed to the page component as props
  };
}
