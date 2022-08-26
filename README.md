# AEMS (Aptiv Electronic Mangement System)

This application lets users keep track of items. Users can be assigned different items from admins. Admins can add new items, update items , and delete items as needed. Items can be viewed, sorted by categories and users.

Users can have one of two statuses, 'admin' or 'default'. Admins can add new items, update items, and delete items as needed. Items can be viewed by category or all together by anyone. Admins can add notes to items, and assign instances of items to users.
**Link to project:** http://recruiters-love-seeing-live-demos.com/

![alt tag](/aptiv.png)

## How It's Made:

**Tech used:** Next JS, Express, Mongo DB , NODE ,Tailwind, MUI , SCSS, bCrypt, passport js

Built with Next/React front end and an Express backend. Tailwind, SCSS, and MUI components were used for styling. MongoDB is used for the database, with passport js for user auth, and passwords encrypted with bcrypt.

## Optimizations

- Instead of making 50 seprate API calls, call it once and pass down as props
- took advantage of useContext for user auth

## Lessons Learned:

I really felt the power of object-oriented programming, encapsulation, and making small parts to build the whole. Rather than making 50 separate API calls, call it once and pass the data down as props.

Found out about useContext out of neccesity, getting a response from the server everytime I needed user auth on a page wasn't realistic. Luckily react has basic global state mangement built in with useContext.

## To-Do

    -on successfull item update get rid of errMsg on /item/all
    -prod only working on firefox?? i think its https/cors issue
