import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = ({ t }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <div className="container">
        <ul className="breadcrumb-list">
          <li>
            <Link to="/">{t.home || 'Home'}</Link>
          </li>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            
            // ✅ Если это последний сегмент (UUID или Slug) — полностью скрываем его
            if (last) return null;

            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const displayName = t[`nav_${value}`] || value.replace(/-/g, ' ');

            return (
              <li key={to}>
                <Link to={to}>{displayName}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Breadcrumbs;