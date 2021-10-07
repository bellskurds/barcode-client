import React, { Component } from 'react';

import LoginSection from '../components/Login/Login';
import ModalSearch from '../components/Modal/ModalSearch';
import ModalMenu from '../components/Modal/ModalMenu';
import Scrollup from '../components/Scrollup/Scrollup';

class Login extends Component {
    render() {
        return (
            <div className="main">
                <LoginSection />
                <ModalSearch />
                <ModalMenu />
                <Scrollup />
            </div>
        );
    }
}

export default Login;