import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useUserContext } from '../context/user';
export default function Home() {
  const [user, setUser] = useUserContext();

  return (
    <div>
      <Head>
        <title>AEMS</title>
        <meta name="description" content="Aptiv Electronic Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col ">
        <Nav />

        <div className="max-w-screen-sm self-center border border-black p-8 m-6">
          <h1 className="text-center mb-3">
            Welcome to{' '}
            <span className="font-bold">
              Atpiv Electronic Management System
            </span>{' '}
            (AEMS)
          </h1>
          <p>
            To use AEMS you must first{' '}
            <Link href="/user/signup">
              <span className="underline cursor-pointer aptiv-primary xl:text-center">
                make an account
              </span>
            </Link>{' '}
            or use one of the{' '}
            <Link href="/user/login">
              <span className="underline cursor-pointer aptiv-primary xl:text-center">
                test accounts
              </span>
            </Link>
            <br />
            <br />
            AEMS is a web application that enables users to track items across a
            large business. Users can add new items, update them if they get
            damaged or lost, and add detailed notes as to the current status of
            the items.
          </p>
        </div>
      </main>
    </div>
  );
}
