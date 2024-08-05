import React from 'react'
import './login.css'
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
  }

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }
  return (
    <>
      <div>
        <h1>Login</h1>
        <div className='display d-flex flex-column justify-content-center align-items-center'>
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
