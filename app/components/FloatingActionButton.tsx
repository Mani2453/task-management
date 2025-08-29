import { PlusIcon } from '@heroicons/react/24/solid';
import React, { MouseEventHandler } from 'react';

interface FloatingActionButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  label?: string;
  className?: string;
}

export default function FloatingActionButton({ onClick, label = 'Add', className = '' }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-indigo-700 active:scale-95 transition-all duration-300 backdrop-blur-md bg-opacity-90 ${className}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
      aria-label={label}
    >
      <PlusIcon className="w-6 h-6" />
      <span className="font-semibold text-base hidden sm:inline">{label}</span>
    </button>
  );
}
