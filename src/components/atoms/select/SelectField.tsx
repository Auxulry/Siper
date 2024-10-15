import React from 'react';

interface SelectFieldProps {
  label?: string;
  name: string;
  value: number | string;
  options: { value: number | string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  errors?: string[];
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  errors = [],
  className = '',
}) => {
  const hasError = errors.length > 0;

  return (
    <div className='mb-4'>
      {label && (
        <label className='block text-gray-700 text-sm font-medium mb-2'>
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded p-2 w-full ${className} ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <div className='mt-1'>
          {errors.map((error, index) => (
            <p key={index} className='text-sm text-red-500'>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectField;
