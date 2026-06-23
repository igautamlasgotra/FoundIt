import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { BellIcon, SunIcon, MoonIcon, MenuIcon, XIcon } from './Icons.jsx';
import Logo from './Logo.jsx';

export default function NavBar() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggle } = useTheme();
  const { unread } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <nav className="nav" aria-label="Main">
      <div className="nav__inner">
        <Logo />

        <div className={`nav__links ${open ? 'is-open' : ''}`}>
          {user ? (
            <>
              <Link className="nav__link" to="/home" onClick={close}>
                Browse
              </Link>
              <Link className="nav__link" to="/report" onClick={close}>
                Report
              </Link>
              {isAdmin && (
                <Link className="nav__link" to="/admin" onClick={close}>
                  Admin
                </Link>
              )}
              <Link className="nav__link" to="/profile" onClick={close}>
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link className="nav__link" to="/" onClick={close}>
                Home
              </Link>
              <Link className="nav__link" to="/login" onClick={close}>
                Browse
              </Link>
              <a className="nav__link" href="/#how" onClick={close}>
                How it works
              </a>
              <a className="nav__link" href="/#contact" onClick={close}>
                Contact
              </a>
            </>
          )}
        </div>

        <div className="nav__right">
          <button
            className="icon-btn"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {user ? (
            <>
              <Link className="bell" to="/notifications" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}>
                <BellIcon size={18} />
                {unread > 0 && <span className="bell__badge">{unread > 9 ? '9+' : unread}</span>}
              </Link>
              <button className="btn btn--ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="nav__link" to="/login">
                Log in
              </Link>
              <Link className="btn" to="/signup">
                Get started
              </Link>
            </>
          )}

          <button
            className="icon-btn nav__burger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
