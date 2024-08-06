import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
import { useEffect, useState } from "react";
import SuprSendInbox from "@suprsend/react-inbox";
import axios from "axios";

const lightColors = {
    primary: '#007bff',
    primaryText: '#212529',
    secondaryText: '#6c757d',
    border: '#dee2e6',
    main: '#ffffff',
    error: '#dc3545'
  }
  
  const sampleLightTheme = {
    bell: { color: '#0000ff' },
    badge: { backgroundColor: lightColors.primary },
    header: {
      container: {
        backgroundColor: lightColors.main,
        borderBottom: `0.5px solid ${lightColors.border}`,
        boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.1)'
      },
      headerText: { color: lightColors.primaryText },
      markAllReadText: { color: lightColors.primary }
    },
    tabs: {
      color: lightColors.primaryText,
      unselectedColor: lightColors.secondaryText + 'D9',
      bottomColor: lightColors.primary,
      badgeColor: 'rgba(0, 123, 255, 0.5)',
      badgeText: lightColors.primaryText
    },
    notificationsContainer: {
      container: {
        backgroundColor: lightColors.main,
        borderColor: lightColors.border
      },
      noNotificationsText: {
        color: lightColors.primaryText
      },
      noNotificationsSubtext: {
        color: lightColors.secondaryText
      },
      loader: { color: lightColors.primary }
    },
    notification: {
      container: {
        borderBottom: `1px solid ${lightColors.border}`,
        readBackgroundColor: lightColors.main,
        unreadBackgroundColor: '#f8f9fa',
        hoverBackgroundColor: '#e9ecef'
      },
      pinnedText: {
        color: lightColors.secondaryText
      },
      pinnedIcon: {
        color: 'red'
      },
      headerText: { color: lightColors.primaryText },
      bodyText: {
        color: lightColors.secondaryText,
        blockquoteColor: 'rgba(0, 123, 255, 0.5)'
      },
      unseenDot: { backgroundColor: lightColors.primary },
      createdOnText: { color: lightColors.secondaryText },
      subtext: { color: '#adb5bd' },
      actions: [
        { container: { backgroundColor: lightColors.primary } },
        {
          container: {
            borderColor: lightColors.border,
            backgroundColor: 'transparent',
            hoverBackgroundColor: lightColors.main
          },
          text: { color: lightColors.secondaryText }
        }
      ],
      expiresText: {
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        color: lightColors.secondaryText,
        expiringBackgroundColor: 'rgba(220, 53, 69, 0.15)',
        expiringColor: lightColors.error
      },
      actionsMenuIcon: {
        color: lightColors.secondaryText,
        hoverBackgroundColor: 'rgba(0, 123, 255, 0.5)'
      },
      actionsMenu: {
        backgroundColor: lightColors.main,
        borderColor: lightColors.border
      },
      actionsMenuItem: { hoverBackgroundColor: 'rgba(0, 123, 255, 0.2)' },
      actionsMenuItemIcon: { color: lightColors.secondaryText },
      actionsMenuItemText: {
        color: lightColors.secondaryText
      }
    },
    toast: {
      container: {
        backgroundColor: lightColors.main,
        borderColor: lightColors.border,
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 1050,  // Ensure it stays on top
      },
      headerText: { color: lightColors.primaryText },
      bodyText: {
        color: lightColors.secondaryText,
        blockquoteColor: lightColors.border
      }
    }
  }
const Navbar = () => {
    const [user, setUser] = useState();
    const [login, setLogin] = useState(false);
    const [subscriberId, setSubscriberId] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const generateSubscriberId = async () => {
            try {
                const response = await axios.post("https://taskmanagertmbackend.vercel.app/api/subsid/subsId_generate", {distinct_id:localStorage.getItem("username")});
                setSubscriberId(response.data);
                console.log(response.data);
            } catch (err) {
                console.error("Error generating subscriber ID:", err);
            }
        };
        
        generateSubscriberId();
    }, [login,user]);
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
                                <>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark" to="/register">
                                        Register
                                    </Link>
                                </li>
                                </>
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
                                        theme={sampleLightTheme}
                                        themeType="light"
                                        workspaceKey={process.env.WorkspaceKey || "o9VRflljs3BibiN7NzJ9"}
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
