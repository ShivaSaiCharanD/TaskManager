import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css'; 

export default function Navbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg body">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Task Manager</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link to='/login' className="btn btn-outline-success mx-2" activeClassName="active">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/register' className="btn btn-outline-success" activeClassName="active">
                                        Register
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-outline-success" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
