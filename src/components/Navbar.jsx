import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
import { useEffect, useState } from "react";
import SuprSendInbox from "@suprsend/react-inbox";
import axios from "axios";

const Navbar = () => {
    const [user, setUser] = useState();
    const [login, setLogin] = useState(false);
    const [subscriberId, setSubscriberId] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const generateSubscriberId = async () => {
            if (!login) return;
            try {
                const username = localStorage.getItem("username");
                const response = await axios.post("https://taskmanagertmbackend.vercel.app/api/subsid/subsId_generate", username);
                setSubscriberId(response.data);
            } catch (err) {
                console.error("Error generating subscriber ID:", err);
            }
        };
        
        generateSubscriberId();
    }, [login]);
    useEffect(() => {
        const generatelogresponse = async () => {
            const token = localStorage.getItem("token");
            const login_response = await axios.get("https://taskmanagertmbackend.vercel.app/api/user/check", {
                headers: {
                    token: token,
                },
            });
            console.log(login_response.data);
            if (login_response.data) {
                setUser(login_response.data);
                setLogin(true);
            }
        }
        generatelogresponse();
    }, [location]);



    const handleLogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setLogin(false);
        navigate("/");
    };

    return (
        <div className="d-flex justify-content-center">
            <nav
                className="navbar navbar-expand-lg navbar-light bg-light shadow rounded m-3"
                style={{ width: "90%", maxWidth: "1200px" }}
            >
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center" to={login ? "/userhome" : "/"}>
                        <img
                            src="./task-list.svg"
                            alt="logo"
                            style={{ width: "40px", height: "40px", padding: "0.8px" }}
                        />
                        <span className="fs-5 text-dark fw-semibold ms-2">
                            {login ? "Home" : "Task Manager"}
                        </span>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {!login ? (
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/login">
                                        Login
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link text-dark fw-bold" to="/userprofile">
                                            {user}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link text-danger fw-bold" onClick={handleLogout}>
                                            Logout
                                        </Link>
                                    </li>
                                    <SuprSendInbox
                                        theme={{
                                            badge: { backgroundColor: "pink", color: "black", margin: "0px" },
                                            bell: { color: "blue" },
                                            header: {
                                                container: { backgroundColor: "#0099ff" },
                                                headertext: { color: "black" },
                                                markAllReadText: { color: "black", fontWeight: "bold" },
                                            },
                                            notification: {
                                                actions: { container: { hoverBackgroundColor: "#349beb" } },
                                                expiresText: { color: "red" },
                                                actionsMenuIcon: { color: "blue" },
                                            },
                                        }}
                                        themeType="light / dark"
                                        workspaceKey="4k-mI1yN3y1o1f4vqutYnzT-nuhRJsGBs2GiNci8iX8"
                                        subscriberId={subscriberId}
                                        distinctId={localStorage.getItem("username")}
                                    />
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
