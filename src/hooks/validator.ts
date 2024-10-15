import { useState } from 'react';
import * as joi from 'joi';

interface ValidationResult {
  [key: string]: string[];
}

const useValidator = <T extends object>(
  schema: joi.ObjectSchema<T>
) => {
  const [errors, setErrors] = useState<ValidationResult>({});

  const validate = (data: T): boolean => {
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const newErrors: ValidationResult = {};

      error.details.forEach((detail) => {
        const key = detail.path[0] as string;
        if (!newErrors[key]) {
          newErrors[key] = [];
        }
        newErrors[key].push(detail.message);
      });

      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  return { errors, validate, setErrors };
};

export default useValidator;
