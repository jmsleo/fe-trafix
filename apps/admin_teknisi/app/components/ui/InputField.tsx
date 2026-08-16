import { InputHTMLAttributes, forwardRef } from 'react';

// Mendefinisikan properti Input
// Memperluas InputHTMLAttributes agar mendukung semua properti bawaan <input> seperti type, placeholder, onChange, dll
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Label opsional di atas input (misal: "Username")
  error?: string; // Pesan error opsional di bawah input
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {/* Render Label jika disediakan */}
        {label && (
          <label className="mb-2 text-sm font-medium text-white">
            {label}
          </label>
        )}
        
        {/* Elemen Input */}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 text-sm transition-colors duration-200
            rounded-[7px] bg-[#231F1A] text-white
            border border-gray-600 placeholder:text-gray-500
            focus:outline-none focus:ring-1 focus:ring-[#B5884D] focus:border-[#B5884D]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[#FF5656] focus:ring-[#FF5656] focus:border-[#FF5656]' : ''}
            ${className}
          `}
          {...props}
        />
        
        {/* Render Pesan Error jika ada */}
        {error && (
          <span className="mt-1 text-xs text-[#FF5656]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;