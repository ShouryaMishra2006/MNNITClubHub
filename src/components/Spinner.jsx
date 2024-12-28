import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 border-opacity-75"></div>
    </div>
  );
};

export default Spinner;
