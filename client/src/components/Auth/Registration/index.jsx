import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { registration } from '../../../actions/user';

import Input from '../../Input';

import '../index.css';
import { NavLink } from 'react-router-dom';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  return (
    <div className='auth'>
      <h2 className="auth__title">Регистрация</h2>
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
        onClick={() => {dispatch(registration(email, password))}}
      >
        Зарегистрироваться
      </button>
      <div className="auth__navlink">
        <span>Есть аккаунт?</span>
        <NavLink to='/login'>Войти</NavLink>
      </div>
    </div>
  )
}

export default Registration
