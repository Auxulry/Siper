import React, { FC } from 'react';
import { TextFieldDeclaration } from '@/types/components/text-field';

const TextArea: FC<TextFieldDeclaration.TextAreaProps> = ({
  label,
  name = 'name',
  placeholder,
  hint,
  errors = [],
  onChange,
  value
}) => {
  const hasError = errors.length > 0;

  const convertParams = (e: React.ChangeEvent<HTMLTextAreaElement>): { target: { name: string, value: string } } => {
    return {
      target: {
        name,
        value: e.target.value as string,
      }
    };
  };

  return (
    <div className='mb-4'>
      {label && <label className='block text-gray-700 text-sm font-medium mb-2'>{label}</label>}
      <textarea
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChange ? onChange(convertParams(e)) : null}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
          hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        }`}
        value={value}
        rows={4}
      />
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

export default TextArea;
