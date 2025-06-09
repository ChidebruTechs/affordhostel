import { useState } from "react";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 md:px-56 py-4 shadow-sm relative">
 
  <div className="text-purple-800 font-bold text-xl flex items-center gap-2">
    <FaHome className="text-teal-600 text-4xl" />
    AffordHostel
  </div>

  <ul className="hidden md:flex gap-6 text-black font-medium">
    <li className="hover:text-purple-800 cursor-pointer">Home</li>
    <li className="hover:text-purple-800 cursor-pointer">About</li>
    <li className="hover:text-purple-800 cursor-pointer">Hostels</li>
    <li className="hover:text-purple-800 cursor-pointer">Contact</li>
  </ul>

  <div className="hidden md:flex gap-3">
    <button className="border-2 border-purple-800 text-purple-800 px-6 py-2 rounded-lg hover:bg-purple-100 text-md">Sign In</button>
    <button className="bg-purple-800 text-white px-6 py-1 rounded-md text-sm hover:bg-purple-900">Sign Up</button>
  </div>

 
  <div className="md:hidden">
    <button onClick={() => setMenuOpen(!menuOpen)}>
      {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
    </button>
  </div>

 
  {menuOpen && (
    <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50">
      <ul className="flex flex-col items-center gap-4 font-medium">
        <li className="hover:text-purple-800 cursor-pointer">Home</li>
        <li className="hover:text-purple-800 cursor-pointer">About</li>
        <li className="hover:text-purple-800 cursor-pointer">Hostels</li>
        <li className="hover:text-purple-800 cursor-pointer">Contact</li>
      </ul>
      <div className="flex gap-3">
        <button className="border border-purple-800 text-purple-800 px-4 py-1 rounded-md hover:bg-purple-100 text-sm">Sign In</button>
        <button className="bg-purple-800 text-white px-4 py-1 rounded-md text-lg hover:bg-purple-900">Sign Up</button>
      </div>
    </div>
  )}
</nav>

  );
};

export default Navbar;
