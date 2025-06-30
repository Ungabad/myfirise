import React from "react";

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CourseModal: React.FC<CourseModalProps> = ({
  open,
  onClose,
  children,
}) => {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative'>
        <button
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl'
          onClick={onClose}
          aria-label='Close'
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default CourseModal;
