import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import ProfileModal from '../Modal/profileModal';
import config from '../../config';
const Header = () => {
    const [modalStatus,setModalStatus] = useState(false);
    const handleLogout = () => {
        window.localStorage.removeItem(config.session_key)
        window.location.href = "/login"
    }
     return (
        <header id="header">
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="navbar navbar-expand">
                <div className="container header">
                    {/* Navbar Brand*/}
                    {/* Navbar */}
                    <ul className="navbar-nav items mx-auto">
                        <li className="nav-item dropdown">
                            <Link className="nav-link" to="/data">Data</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/barcode_list" className="nav-link">Barcode List</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link" to="/">Barcode Scan</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link not_reload" to="#">Admin <i className="fas fa-angle-down ml-1" /></Link>
                            <ul className="dropdown-menu">
                                <li className="nav-item"><Link className="nav-link not_reload" to="#" onClick={(e)=>{handleLogout()}}>Logout</Link></li>
                                <li className="nav-item"><Link className="nav-link not_reload" to="#" onClick={() => setModalStatus(true)}>Profile</Link></li>
                            </ul>
                        </li>
                    </ul>
                  
                    {/* Navbar Toggler */}
                    <ul className="navbar-nav toggle">
                        <li className="nav-item">
                            <Link to="#" className="nav-link" data-toggle="modal" data-target="#menu">
                                <i className="fas fa-bars toggle-icon m-0" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            {
                modalStatus?<ProfileModal status={modalStatus} handleShowModal={setModalStatus} />:""
            }
            
        </header>
    );
};

export default Header;