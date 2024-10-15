'use client';

import React, { useState } from 'react';
import Paper from '@/components/atoms/paper/Paper';
import TextField from '@/components/atoms/text-field/TextField';
import useValidator from '@/hooks/validator';
import * as joi from 'joi';
import {DOMDeclaration} from '@/types/commons/dom';
import {useRouter} from 'next/navigation';
import Alert from '@/components/atoms/alert/Alert';
import {AlertDeclaration} from '@/types/components/alert';
import {signIn} from 'next-auth/react';

interface FormData {
  email: string;
  password: string;
}

const schema = joi.object<FormData>({
  email: joi.string().email({ tlds: false }).required().label('Email'),
  password: joi.string().required().label('Password'),
});

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState<{
    type: AlertDeclaration.AlertType,
    message: string;
    open: boolean;
  }>({
    type: 'success',
    message: 'success',
    open: false
  });

  const router = useRouter();

  const { errors, validate } = useValidator(schema);

  const handleChange = (e: { target: DOMDeclaration.EventTarget }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate(formData)) {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (res?.error) {
        setAlert({
          type: 'danger',
          message: res?.error as string,
          open: true,
        });
      }

      if (res?.ok) {
        setAlert({
          type: 'success',
          message: 'Login Successfully',
          open: true,
        });

        router.push('/internal');
      }
    }
  };

  return (
    <main className='flex items-center justify-center min-h-screen relative'>
      {alert.open && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert((prev) => ({
            ...prev,
            open: false,
          }))}
        />
      )}
      <Paper className='w-full max-w-md p-6'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Email'
            name='email'
            type='email'
            placeholder='Enter your email'
            errors={errors.email}
            onChange={handleChange}
          />
          <TextField
            label='Password'
            name='password'
            type='password'
            placeholder='Enter your password'
            errors={errors.password}
            onChange={handleChange}
          />
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            Login
          </button>
        </form>
      </Paper>
    </main>
  );
}
