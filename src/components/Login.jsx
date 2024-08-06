import React from 'react'
import './login.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async() => {
    try {
      const response = await axios.post('http://localhost:4000/api/user/login', { username, password });
      console.log(response.data);
      if (response.data.status) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }
  return (
    <>
      <div className='display d-flex flex-column justify-content-center align-items-center container'>
        <h1>Login</h1>
        <div >
          <div>
            <p className='form-label'>Username</p>
            <input type="text" id='username' onChange={handleUsername} className='form-field' aria-label='Username' />
          </div>
          <div>
            <p className='form-label'>Password</p>
            <input type="password" id='password' onChange={handlePassword} className='form-field' aria-label='Password' />
          </div>
          <div>
            <button className='btn btn-primary' onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </>
  )
}
