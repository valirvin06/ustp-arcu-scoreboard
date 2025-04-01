
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-ustp text-white shadow-md py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold">
              USTP Claveria ArCu Days 2025
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/admin">
                <Button variant="secondary">Admin Panel</Button>
              </Link>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="secondary">Admin Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
