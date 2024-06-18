import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'

const NotFound = () => {
  const loginPath = '/login';
  const homePath = '/home';
  const isAuth = useSelector(state => state.user.isAuth);
  return (
    <div className='notfound'>
      <h2 className="notfound__title">Упс!</h2>
      <div className="notfound__description">Страница не найдена</div>
      { isAuth ?
        <div className="notfound__link"><NavLink to={homePath}>Перейти на главную страницу</NavLink></div>
        :
        <div className="notfound__link"><NavLink to={loginPath}>Перейти на страницу входа</NavLink></div>
      }
    </div>
  )
}

export default NotFound
