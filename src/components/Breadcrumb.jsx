import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import './Breadcrumb.css';

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap = {
    '': 'Home',
    'games': 'All Games',
    'wishlist': 'My Wishlist',
    'about': 'About',
  };

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            <FaHome className="breadcrumb-icon" />
            <span>Home</span>
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li key={routeTo} className="breadcrumb-item">
              <FaChevronRight className="breadcrumb-separator" />
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {displayName}
                </span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

