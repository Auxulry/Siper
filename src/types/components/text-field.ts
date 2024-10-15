import {InputHTMLAttributes, ReactNode} from 'react';

export declare namespace TextFieldDeclaration {
  interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    type?: string;
    errors?: string[];
    hint?: string;
    isTextArea?: boolean;
    onChange?: (e: { target: { name: string, value: string | number } }) => void
    append?: ReactNode;
    prepend?: ReactNode;
  }

  interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    type?: string;
    errors?: string[];
    hint?: string;
    isTextArea?: boolean;
    onChange?: (e: { target: { name: string, value: string | number} }) => void
  }
}
