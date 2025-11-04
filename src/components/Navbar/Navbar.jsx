import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, NavLink } from 'react-router-dom'
// import CategorySidebar from '../CategorySidebar' // Archivo eliminado en merge
import './Navbar.css'

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext)

  return (
    <aside className="navbar">
      <div className="navbar__top">
        <Link to="/" className="navbar__logo" aria-label="Ir al inicio">
          <img
            src="https://dcdn-us.mitiendanube.com/stores/005/572/435/themes/common/logo-361476303-1745245688-cc2c95556edd9c5e5c2d51e099859cfe1745245688.jpg?0"
            alt="Haversack"
          />
        </Link>

        <nav className="navbar__menu" aria-label="Navegacion principal">
          <NavLink to="/" className="navbar__link">
            Inicio
          </NavLink>
          <NavLink to="/productos" className="navbar__link">
            Productos
          </NavLink>
          <NavLink to="/contacto" className="navbar__link">
            Contacto
          </NavLink>
          {isAuthenticated && isAdmin() && (
            <NavLink to="/admin" className="navbar__link">
              Admin
            </NavLink>
          )}
          {isAuthenticated && !isAdmin() && (
            <NavLink to="/perfil" className="navbar__link">
              Mi Perfil
            </NavLink>
          )}
        </nav>
      </div>

      <div className="navbar__bottom">
        <p className="navbar__social">INSTAGRAM</p>
        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <span className="navbar__user-name">
                {user?.name || user?.email}
              </span>
              <button className="navbar__action" onClick={logout}>
                CERRAR SESIÓN
              </button>
            </>
          ) : (
            <>
              <Link to="/registro" className="navbar__action">
                CREAR CUENTA
              </Link>
              <Link to="/login" className="navbar__action">
                INGRESAR
              </Link>
            </>
          )}
        </div>
      </div>

      {/* <CategorySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
    </aside>
  )
}

export default Navbar