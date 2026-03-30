import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GlobalPlayer } from './GlobalPlayer.jsx';

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();

  const linkClass = ({ isActive }) => `adam-nav-link${isActive ? ' adam-nav-link--active' : ''}`;

  return (
    <div className="adam-app">
      <header
        className="adam-glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          margin: '0.75rem auto 0',
          width: 'min(1180px, calc(100% - 2.5rem))',
          borderRadius: 'var(--radius-lg)',
          padding: '0.65rem 1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span
              className="adam-display"
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: 'var(--adam-ink)',
              }}
            >
              ADAM
            </span>
          </Link>
          <nav
            style={{
              display: 'flex',
              gap: '0.15rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 auto',
            }}
          >
            <NavLink to="/discover" className={linkClass}>
              Главная
            </NavLink>
            <NavLink to="/search" className={linkClass}>
              Поиск
            </NavLink>
            <NavLink to="/artists" className={linkClass}>
              Артисты
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/library" className={linkClass}>
                Библиотека
              </NavLink>
            )}
          </nav>
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <span style={{ color: 'var(--adam-faint)', fontSize: '0.72rem', letterSpacing: '0.06em', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name || user?.email}
                </span>
                <button type="button" className="adam-btn adam-btn--minimal" style={{ fontSize: '0.72rem', padding: '0.45rem 0.9rem' }} onClick={logout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="adam-btn adam-btn--minimal" style={{ fontSize: '0.72rem', padding: '0.45rem 0.9rem' }}>
                  Вход
                </Link>
                <Link to="/register" className="adam-btn" style={{ fontSize: '0.72rem', padding: '0.45rem 1rem' }}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="adam-page">
        <Outlet />
      </main>
      <GlobalPlayer />
    </div>
  );
}
