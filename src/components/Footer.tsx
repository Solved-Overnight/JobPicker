import React from 'react';

interface FooterProps {
  darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer className={`py-4 px-6 ${
      darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-600'
    } shadow-sm mt-auto`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div>&copy; {new Date().getFullYear()} AI Job Hunter. All rights reserved.</div>
        <div className="mt-2 md:mt-0">
          <ul className="flex space-x-6">
            <li>
              <a href="#" className={`${darkMode ? 'hover:text-white' : 'hover:text-blue-600'} transition-colors`}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className={`${darkMode ? 'hover:text-white' : 'hover:text-blue-600'} transition-colors`}>
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className={`${darkMode ? 'hover:text-white' : 'hover:text-blue-600'} transition-colors`}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
