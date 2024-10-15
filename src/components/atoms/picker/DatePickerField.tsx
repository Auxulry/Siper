import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerFieldProps {
  label?: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  errors?: string[];
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  selectedDate,
  onChange,
  placeholder = 'Select date',
  className = '',
  errors = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasError = errors.length > 0;

  const handleClick = () => setIsOpen(!isOpen);
  const handleChange = (date: Date | null) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div className='mb-4'>
      {label && <label className='block text-gray-700 text-sm font-medium mb-2'>{label}</label>}
      <div className='relative'>
        <input
          type='text'
          className={`border rounded p-2 w-full cursor-pointer ${className} ${
            hasError ? 'border-red-500' : 'border-gray-300'
          }`}
          value={selectedDate ? selectedDate.toLocaleDateString() : ''}
          onClick={handleClick}
          readOnly
          placeholder={placeholder}
        />
        {isOpen && (
          <div className='absolute top-full left-0 mt-2 z-50'>
            <DatePicker
              selected={selectedDate}
              onChange={handleChange}
              inline
            />
          </div>
        )}
      </div>
      {hasError && (
        <div className='mt-1'>
          {errors.map((error, index) => (
            <p key={index} className='text-sm text-red-500'>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePickerField;
