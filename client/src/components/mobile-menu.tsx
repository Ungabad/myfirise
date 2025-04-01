import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: { href: string; label: string }[];
  currentPath: string;
  openExpenseModal: () => void;
}

const MobileMenu = ({ isOpen, navLinks, currentPath, openExpenseModal }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="border-t border-neutral-100 bg-white px-4 py-2 shadow-lg md:hidden">
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              currentPath === link.href
                ? "text-primary-600"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/profile"
          className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <span className="material-icons mr-2 text-neutral-700">person</span>
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
