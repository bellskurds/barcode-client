import React ,{useState} from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';
import ProfileModal from '../Modal/profileModal';
const ModalMenu = () => {
    const [modalStatus,setModalStatus] = useState(false);
    const handleLogout = () => {
        window.localStorage.removeItem(config.session_key)
        window.location.href = "/login"
    }
    return (
        <div id="menu" className="modal fade p-0">
            <div className="modal-dialog dialog-animated">
                <div className="modal-content h-100">
                    <div className="modal-header" data-dismiss="modal">
                        Menu <i className="far fa-times-circle icon-close" />
                    </div>
                    <div className="menu modal-body">
                        <ul className="navbar-nav items mx-auto">
                            <li className="nav-item dropdown">
                                <Link className="nav-link" to="/data">Datos</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/barcode_list" className="nav-link">Empleados</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link" to="/">Escanear</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link not_reload" to="#">Admin <i className="fas fa-angle-down ml-1" /></Link>
                                <ul className="dropdown-menu">
                                    <br/>
                                    <li className="nav-link"><Link className="nav-link not_reload" to="#" onClick={(e)=>{handleLogout()}}>Cerrar sesión</Link></li>
                                    <br/>
                                    <li className="nav-link profile"><Link className="nav-link not_reload" to="#" onClick={() => setModalStatus(true)}>Perfil</Link></li>
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
                </div>
            </div>
            {
                modalStatus?<ProfileModal status={modalStatus} handleShowModal={setModalStatus} />:""
            }
        </div>
    );
};

export default ModalMenu;