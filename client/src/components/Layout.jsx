import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GlobalPlayer } from './GlobalPlayer.jsx';
import { NowPlayingPanel } from './NowPlayingPanel.jsx';

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobile, setMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 820 : false));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  useEffect(() => {
    function onResize() {
      const nextMobile = window.innerWidth <= 820;
      setMobile(nextMobile);
      if (!nextMobile) setMobileOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const linkClass = ({ isActive }) => `adam-nav-link${isActive ? ' adam-nav-link--active' : ''}`;
  const shellClass = `adam-shell${sidebarHidden ? ' adam-shell--sidebar-hidden' : ''}${mobileOpen ? ' adam-shell--mobile-open' : ''}`;

  function toggleSidebar() {
    if (mobile) {
      setMobileOpen((v) => !v);
    } else {
      setSidebarHidden((v) => !v);
    }
  }

  function closeMobileSidebar() {
    if (mobile) setMobileOpen(false);
  }

  return (
    <div className={shellClass}>
      <button type="button" className="adam-sidebar-toggle" onClick={toggleSidebar} aria-label={mobile ? 'Открыть меню' : sidebarHidden ? 'Показать панель' : 'Скрыть панель'}>
        {mobile ? (mobileOpen ? '✕' : '☰') : sidebarHidden ? '☰' : '✕'}
      </button>

      <aside className="adam-sidebar adam-glass" aria-label="Боковая панель">
        <Link to="/" className="adam-brand">
          <span className="adam-brand__word">ADAM</span>
        </Link>

        <nav className="adam-nav" aria-label="Навигация">
          <NavLink to="/discover" className={linkClass} onClick={closeMobileSidebar}>
            Обзор
          </NavLink>
          <NavLink to="/library" className={linkClass} onClick={closeMobileSidebar}>
            Библиотека
          </NavLink>
          <NavLink to="/artists" className={linkClass} onClick={closeMobileSidebar}>
            Исполнители
          </NavLink>
          <NavLink to="/search" className={linkClass} onClick={closeMobileSidebar}>
            Поиск
          </NavLink>
        </nav>

        <div className="adam-sidebar__section">
          <div className="adam-sidebar__section-title">Аккаунт</div>
          {isAuthenticated ? (
            <div className="adam-mini-list">
              <div className="adam-mini-item">
                <div className="adam-dot" aria-hidden />
                <div>
                  <div className="adam-mini-item__name">{user?.name || user?.email}</div>
                  <div className="adam-mini-item__meta">в сети</div>
                </div>
              </div>
              <button type="button" className="adam-btn adam-btn--minimal adam-btn--sm" onClick={logout}>
                Выйти
              </button>
            </div>
          ) : (
            <div className="adam-mini-list">
              <Link to="/login" className="adam-btn adam-btn--minimal adam-btn--sm" onClick={closeMobileSidebar}>
                Вход
              </Link>
              <Link to="/register" className="adam-btn adam-btn--sm-wide" onClick={closeMobileSidebar}>
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </aside>
      <button type="button" className="adam-sidebar-backdrop" aria-label="Закрыть меню" onClick={() => setMobileOpen(false)} />

      <main className="adam-main">
        <Outlet />
      </main>

      <NowPlayingPanel />
      <GlobalPlayer />
    </div>
  );
}
