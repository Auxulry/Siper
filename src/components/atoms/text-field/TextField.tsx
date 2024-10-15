import React, { FC } from 'react';
import { TextFieldDeclaration } from '@/types/components/text-field';
import {DOMDeclaration} from '@/types/commons/dom';

const TextField: FC<TextFieldDeclaration.TextFieldProps> = ({
  label,
  name = 'name',
  placeholder,
  hint,
  errors = [],
  type = 'text',
  onChange,
  prepend,
  append,
  value
}) => {
  const hasError = errors.length > 0;

  const convertParams = (e: React.ChangeEvent<HTMLInputElement>): { target: DOMDeclaration.EventTarget } => {
    return {
      target: {
        name,
        value: e.target.value,
      }
    };
  };

  return (
    <div className='mb-4'>
      {label && <label className='block text-gray-700 text-sm font-medium mb-2'>{label}</label>}
      <div className={`flex items-center border rounded-md focus-within:ring-2 focus-within:border-transparent ${
        hasError ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-300 focus-within:ring-blue-500'
      }`}>
        {prepend && <div className='pl-2'>{prepend}</div>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange ? onChange(convertParams(e)) : null}
          className={`flex-grow p-2 focus:outline-none ${
            prepend ? 'pl-2' : ''
          } ${append ? 'pr-2' : ''}`}
        />
        {append && <div className='pr-2'>{append}</div>}
      </div>
      {hint && !hasError && (
        <p className='text-sm text-gray-500 mt-1'>{hint}</p>
      )}
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

export default TextField;
