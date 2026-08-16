import React from 'react';

// Tentukan properti minimal yang diperlukan oleh tombol (Hanya untuk Slicing)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  // === GAYA TAILWIND HASIL SLICING DARI FIGMA ===
  // Kita buat gaya gradien emas yang sudah pixel-perfect
  let buttonClasses = "flex items-center justify-center gap-[6px] h-[44px] px-6 rounded-[9px] font-medium transition-opacity shrink-0 bg-gradient-to-r from-[#BF8F51] to-[#523D22] border border-[#BF8F51] text-[#17130E] shadow-lg hover:opacity-90";
  // ===========================================

  return (
    <button 
      className={`${buttonClasses} ${className}`} // className tambahan masih diterima
      {...props} // props lain (seperti onClick, type) masih diterima
    >
      {children}
    </button>
  );
};

export default Button;