import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className='border-t border-neutral-200 bg-white'>
      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='md:flex md:items-center md:justify-between'>
          <div className='mb-6 flex items-center space-x-2 md:mb-0'>
            <span className='material-icons text-primary-500'>
              account_balance
            </span>
            <h2 className='text-lg font-semibold text-primary-600'>FiRise</h2>
          </div>

          <div className='flex flex-wrap justify-center space-x-6 md:justify-end'>
            <Link
              href='/about'
              className='text-sm text-neutral-600 hover:text-primary-600'
            >
              About
            </Link>
            <Link
              href='/privacy'
              className='text-sm text-neutral-600 hover:text-primary-600'
            >
              Privacy
            </Link>
            <Link
              href='/terms'
              className='text-sm text-neutral-600 hover:text-primary-600'
            >
              Terms
            </Link>
            <Link
              href='/contact'
              className='text-sm text-neutral-600 hover:text-primary-600'
            >
              Contact
            </Link>
            <Link
              href='/help'
              className='text-sm text-neutral-600 hover:text-primary-600'
            >
              Help Center
            </Link>
          </div>
        </div>

        <div className='mt-8 border-t border-neutral-200 pt-8 md:flex md:items-center md:justify-between'>
          <p className='text-center text-sm text-neutral-500 md:text-left'>
            © {new Date().getFullYear()} FiRise. All rights reserved.
          </p>
          <div className='mt-4 flex justify-center space-x-6 md:mt-0'>
            <a
              href='#'
              className='text-neutral-400 hover:text-primary-500'
              aria-label='Facebook'
            >
              <span className='material-icons'>facebook</span>
            </a>
            <a
              href='#'
              className='text-neutral-400 hover:text-primary-500'
              aria-label='Instagram'
            >
              <span className='material-icons'>camera_alt</span>
            </a>
            <a
              href='#'
              className='text-neutral-400 hover:text-primary-500'
              aria-label='Twitter'
            >
              <span className='material-icons'>chat</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
