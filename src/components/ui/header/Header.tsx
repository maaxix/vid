import { Link } from 'react-router-dom';

import { toggleSidebar, toggleTheme } from "../layout/Layout";

import './Header.css';
import LoginButton from '../../auth/LoginButton';

export default function Header() {


  return (
    <header className="header gap-4">
        <div>
          <button className="btn btn-round" onClick={toggleSidebar}><i className="icon icon-menu"></i></button>
        </div>
        {/* Logo */}
        <div className="">
          <a href="" className="logo grow"><i className="icon icon-logo"> </i></a>
        </div>
        <div className="app-title grow">Bookee</div>
        {/* search bar*/}
        {/* 
        <div className="grow">
          <div className="flex grow-txt input-focus">
            <div className="">
              <button className="btn btn-round"><i className="icon icon-search"></i></button>
            </div>
            <input className="text-input grow" placeholder="All crops"></input>
          </div>
        </div>
        */}
        {/* Menus */}
        <ul className="flex gap-2 nav">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li className="dropdown vlist">
            <Link className="" to="/dashboard">Dashboard</Link>
            <div className="dropdown-menu fade-down">
              <ul className="flex-col">
                <li><Link className="nav-link" to="/">option 1</Link></li>
                <li><Link className="nav-link" to="/about">About</Link></li>
                <li><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
          </li>
        </ul>

        <div>
          <button className="btn btn-round" onClick={toggleTheme}><i className="icon icon-sun"></i></button>
        </div>
        <div>
          <LoginButton/>
        </div>
        {/*<LoginButton/> */}
        
    </header>
  );
}