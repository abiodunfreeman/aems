import Link from 'next/link';
import axios from 'axios';
import {
  Button,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Menu,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useEffect, useState } from 'react';
import Router from 'next/router';
import { useUserContext } from '../context/user';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      light: '#f25633e2',
      main: '#f84018',
    },
  },
});
export default function Nav() {
  const SERVER_URL = 'https://aems-server.herokuapp.com';
  const CLIENT_URL = 'https://aems.vercel.app';
  const [user, setUser] = useUserContext();

  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [itemAnchorEl, setItemAnchorEl] = useState(null);

  const categoryOpen = Boolean(categoryAnchorEl);
  const userOpen = Boolean(userAnchorEl);
  const itemOpen = Boolean(itemAnchorEl);

  const handleCategoryMenuClick = event => {
    setCategoryAnchorEl(event.currentTarget);
  };
  const handleCategoryMenuClose = () => {
    const target = document.getElementById('basic-category-button');
    target.classList.remove('menu-hover');
    setCategoryAnchorEl(null);
  };
  const handleCategoryMenuHover = event => {
    const target = event.currentTarget;
    target.classList.add('menu-hover');
    // setCategoryAnchorEl(event.currentTarget);
  };
  const handleUserMenuClick = event => {
    const target = event.currentTarget;
    target.classList.add('menu-hover');
    setUserAnchorEl(event.currentTarget);
  };
  const handleUserMenuClose = () => {
    const target = document.getElementById('basic-user-button');
    target.classList.remove('menu-hover');
    setUserAnchorEl(null);
  };
  const handleItemMenuClick = event => {
    setItemAnchorEl(event.currentTarget);
  };
  const handleItemMenuClose = () => {
    const target = document.getElementById('basic-item-button');
    target.classList.remove('menu-hover');
    setItemAnchorEl(null);
  };
  const handleUserMenuHover = event => {
    const target = event.currentTarget;
    target.classList.add('menu-hover');
    // setUserAnchorEl(event.currentTarget);
  };
  const handleMenuMouseLeave = event => {
    const target = event.currentTarget;
    target.classList.remove('menu-hover');
  };
  const handleItemMenuHover = event => {
    const target = event.currentTarget;
    target.classList.add('menu-hover');
    // setItemAnchorEl(event.currentTarget);
  };

  const handleLinkClick = string => {
    // Closes/Opens menu and changes hamburger icon on click
    // Click with param "onlyClose" only closes the menu and reverts the ham Icon
    const hamburgerIcon = document.getElementById('ham-container');
    const dropDown = document.getElementById('nav-drop-down');
    const body = document.querySelector('body');
    body.classList.remove('overflow-hidden');
    if (string === 'onlyClose') {
      !dropDown.classList.contains('hidden') &&
        dropDown.classList.add('hidden');

      dropDown.classList.contains('flex') && dropDown.classList.remove('flex');

      hamburgerIcon &&
        hamburgerIcon.classList.contains('change') &&
        hamburgerIcon.classList.remove('change');

      return;
    }

    dropDown.classList.toggle('hidden');
    dropDown.classList.toggle('flex');
    hamburgerIcon.classList.toggle('change');
  };
  const logout = async () => {
    localStorage.clear();
    const res = await axios.get(`${SERVER_URL}/logout`);
    setUser(false);
    Router.push('/user/logout');
  };

  const toggleHam = () => {
    const hamburgerIcon = document.getElementById('ham-container');
    const dropDown = document.getElementById('nav-drop-down');
    const body = document.querySelector('body');
    body.classList.toggle('overflow-hidden');
    dropDown.classList.toggle('hidden');
    dropDown.classList.toggle('flex');
    hamburgerIcon.classList.toggle('change');
  };
  useEffect(() => {
    if (!user && localStorage.getItem('user')) {
      console.log(...localStorage.getItem('user'));
      setUser(localStorage.getItem('user'));
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <div className="nav-container ">
        <nav id="navbar">
          {user ? (
            <p className="text-white absolute bottom-1 right-3 aptiv-primary">
              Welcome:{' '}
              <span className="text-white font-bold">{user.username}</span>
            </p>
          ) : (
            <p className="aptiv-primary absolute bottom-1 right-3">
              not logged in
            </p>
          )}
          <div id="nav-container">
            {/* ALWAYS */}
            <Link href={user ? `/user/[id]?id=${user._id}` : '/'} as={user._id}>
              <div
                id="nav-logo"
                className="flex justify-center items-center  cursor-pointer"
                onClick={() => handleLinkClick('onlyClose')}
              >
                <div className="orange-dot"></div>
                <h1 className="text-bold text-center text-3xl uppercase ">
                  aptiv
                </h1>
                <div className="orange-dot" />
              </div>
            </Link>
            {/* USER AUTH */}
            {user && (
              <div id="nav-logged-in" className="">
                {/* DESKTOP */}
                <div id="nav-logged-in-desktop">
                  {/* USER MENU*/}
                  <div>
                    <p
                      id="basic-user-button"
                      aria-controls={userOpen ? 'basic-user-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={userOpen ? 'true' : undefined}
                      onClick={handleUserMenuClick}
                      onMouseEnter={handleUserMenuHover}
                      onMouseLeave={handleMenuMouseLeave}
                      className="nav-link"
                    >
                      user
                    </p>

                    <Menu
                      id="basic-user-menu"
                      anchorEl={userAnchorEl}
                      open={userOpen}
                      onClose={handleUserMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-user-button',
                      }}
                      sx={{ marginTop: '5px' }}
                    >
                      <MenuItem onClick={handleUserMenuClose}>
                        {' '}
                        <Link href="/user/all">
                          <p className="nav-link">view all users</p>
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleUserMenuClose}>
                        {' '}
                        <Link href="/user/signup">
                          <p className="nav-link">create</p>
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>
                  {/* CATEGORIES MENU */}
                  <div>
                    <p
                      id="basic-category-button"
                      aria-controls={
                        categoryOpen ? 'basic-category-menu' : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={categoryOpen ? 'true' : undefined}
                      onClick={handleCategoryMenuClick}
                      onMouseEnter={handleCategoryMenuHover}
                      className="nav-link"
                      onMouseLeave={handleMenuMouseLeave}
                    >
                      CATEGORIES
                    </p>
                    <Menu
                      id="basic-category-menu"
                      anchorEl={categoryAnchorEl}
                      open={categoryOpen}
                      onClose={handleCategoryMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      sx={{ marginTop: '5px' }}
                    >
                      <MenuItem onClick={handleCategoryMenuClose}>
                        {' '}
                        <Link href="/item/category">
                          <p className="nav-link">view all</p>
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleCategoryMenuClose}>
                        {' '}
                        <Link href="/item/category/new">
                          <p className="nav-link">create</p>
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>
                  {/* ITEMS MENU */}
                  <div>
                    <p
                      id="basic-item-button"
                      aria-controls={itemOpen ? 'basic-item-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={itemOpen ? 'true' : undefined}
                      onClick={handleItemMenuClick}
                      onMouseEnter={handleItemMenuHover}
                      onMouseLeave={handleMenuMouseLeave}
                      className="nav-link"
                    >
                      ITEMS
                    </p>
                    <Menu
                      id="basic-item-menu"
                      anchorEl={itemAnchorEl}
                      open={itemOpen}
                      onClose={handleItemMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-item-button',
                      }}
                      sx={{ marginTop: '5px' }}
                    >
                      <MenuItem onClick={handleItemMenuClose}>
                        {' '}
                        <Link href="/item/all">
                          <p className="nav-link">view all</p>
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleItemMenuClose}>
                        {' '}
                        <Link href="/item/instance">
                          <p className="nav-link">view instances</p>
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleItemMenuClose}>
                        {' '}
                        <Link href="/item/new">
                          <p className="nav-link">create</p>
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>

                  {/* LOGOUT */}
                  <Link href="/">
                    <Button
                      onClick={() => logout()}
                      color="error"
                      variant="outlined"
                    >
                      logout
                    </Button>
                  </Link>
                </div>
                {/* MOBILE HAMBURGER */}
                <div id="ham-container" onClick={() => toggleHam()}>
                  <div className="bar1"></div>
                  <div className="bar2"></div>
                  <div className="bar3"></div>
                </div>
              </div>
            )}

            {/* LOGGED OUT */}
            {!user && (
              <div id="nav-logged-out">
                {' '}
                <Link href="/user/signup">
                  <p className="nav-link">sign up</p>
                </Link>
                <Link href="/user/login">
                  <p className="nav-link">login</p>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE NAV */}
          <section id="nav-drop-down" className="hidden">
            {/* USER */}
            <Accordion
              sx={{
                backgroundColor: 'rgb(0,0,0)',
                width: '100%',
                borderBottom: '1px solid #6c757d',
                borderRadius: '0',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#f84018' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ color: 'white' }}
              >
                <span className="ml-5vw">USER</span>
              </AccordionSummary>
              <AccordionDetails sx={{ color: 'white', paddingLeft: '70px;' }}>
                <Link href="/user/all">
                  <p className="nav-link" onClick={() => handleLinkClick()}>
                    veiw all users
                  </p>
                </Link>
                <Link href="/user/signup">
                  <p className="nav-link" onClick={() => handleLinkClick()}>
                    create a new user
                  </p>
                </Link>
              </AccordionDetails>
            </Accordion>
            {/* ITEM */}
            <Accordion
              sx={{
                backgroundColor: 'rgb(0,0,0)',
                width: '100%',
                borderBottom: '1px solid #6c757d',
                borderRadius: '0',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#f84018' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ color: 'white' }}
              >
                <span className="ml-5vw">ITEMS</span>
              </AccordionSummary>
              <AccordionDetails sx={{ color: 'white', paddingLeft: '70px;' }}>
                <Link href="/item/new">
                  <p className="nav-link " onClick={() => handleLinkClick()}>
                    create an item
                  </p>
                </Link>
                <Link href="/item/all">
                  <p className="nav-link " onClick={() => handleLinkClick()}>
                    all items
                  </p>
                </Link>

                <Link href="/item/instance">
                  <p className="nav-link " onClick={() => handleLinkClick()}>
                    view all instances
                  </p>
                </Link>
              </AccordionDetails>
            </Accordion>
            {/* CATEGORIES */}
            <Accordion
              sx={{
                backgroundColor: 'rgb(0,0,0)',
                width: '100%',
                borderBottom: '1px solid #6c757d',
                borderRadius: '0',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#f84018' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ color: 'white' }}
              >
                <span className="ml-5vw">CATEGORIES</span>
              </AccordionSummary>
              <AccordionDetails sx={{ color: 'white', paddingLeft: '70px;' }}>
                <Link href="/item/category">
                  <p className="nav-link" onClick={() => handleLinkClick()}>
                    veiw all categories
                  </p>
                </Link>
                <Link href="/item/category/new">
                  <p className="nav-link" onClick={() => handleLinkClick()}>
                    create a new category
                  </p>
                </Link>
              </AccordionDetails>
            </Accordion>

            <Button onClick={() => logout()} color="error">
              logout
            </Button>
          </section>
        </nav>
        <div id="nav-padding"></div>
      </div>
    </ThemeProvider>
  );
}
