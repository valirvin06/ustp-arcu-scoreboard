
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ustp text-white py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">USTP Claveria ArCu Days 2025</h3>
            <p className="text-sm mt-1">University of Science and Technology of Southern Philippines</p>
          </div>
          <div className="text-sm">
            <p>&copy; {currentYear} USTP Claveria. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
