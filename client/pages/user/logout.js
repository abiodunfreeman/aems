import Nav from '../../components/Nav';
export default function Logout() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Nav />

      <h1 className="font-bold text-5xl uppercase text-center  m-auto">
        Logged out
      </h1>
    </div>
  );
}
