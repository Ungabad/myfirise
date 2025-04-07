import { useState } from "react";
import { Link, useLocation } from "wouter";
import MobileMenu from "./mobile-menu";

interface NavbarProps {
  openExpenseModal: () => void;
}

const Navbar = ({ openExpenseModal }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
    { href: "/goals", label: "Goals" },
    { href: "/education", label: "Learn" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <header className='sticky top-0 z-10 border-b border-neutral-100 bg-white shadow-sm'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex items-center space-x-2'>
          <span className='material-icons text-primary-500'>
            account_balance
          </span>
          <h1 className='text-xl font-semibold text-primary-600'>FiRise - Building Financial Freedom</h1>
        </div>

        <button
          type='button'
          className='rounded-md p-2 text-neutral-700 md:hidden'
          onClick={toggleMobileMenu}
          aria-label='Toggle menu'
        >
          <span className='material-icons'>menu</span>
        </button>

        <nav className='hidden items-center space-x-1 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                location === link.href
                  ? "text-primary-600"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href='/profile'
            className='ml-4 flex items-center rounded-full bg-primary-50 p-1'
          >
            <span className='material-icons text-primary-600'>person</span>
          </Link>
        </nav>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        navLinks={navLinks}
        currentPath={location}
        openExpenseModal={openExpenseModal}
      />
    </header>
  );
};

export default Navbar;
