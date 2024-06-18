import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import Input from '../../Input'

import { login } from '../../../actions/user';

import '../index.css';
import { NavLink } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  return (
    <div className='auth'>
      <h2 className="auth__title">Вход</h2>
      <Input
        type='email'
        value={email}
        placeholder='Введите email'
        setValue={setEmail}
      />
      <Input
        type='password'
        value={password}
        placeholder='Введите пароль'
        setValue={setPassword}
      />
      <button className='auth__btn'
        onClick={() => dispatch(login(email, password))}
      >
        Войти
      </button>
      <div className="auth__navlink">
        <span>Нет аккаунта?</span>
        <NavLink to='/registration'>Зарегистрироваться</NavLink>
      </div>
    </div>
  )
}

export default Login
