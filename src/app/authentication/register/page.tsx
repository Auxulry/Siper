'use client';

import React, { useState } from 'react';
import Paper from '@/components/atoms/paper/Paper';
import TextField from '@/components/atoms/text-field/TextField';
import useValidator from '@/hooks/validator';
import * as joi from 'joi';
import {DOMDeclaration} from '@/types/commons/dom';
import {register} from '@/servers/user.action';
import Alert from '@/components/atoms/alert/Alert';
import {AlertDeclaration} from '@/types/components/alert';
import {useRouter} from 'next/navigation';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const schema = joi.object<FormData>({
  name: joi.string().required().label('Name'),
  email: joi.string().email({ tlds: false }).required().label('Email'),
  password: joi.string().min(6).required().label('Password'),
  phone: joi.string().required().label('Phone'),
});

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const { errors, validate } = useValidator(schema);

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

  const handleChange = (e: { target: DOMDeclaration.EventTarget }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate(formData)) {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (res?.code !== 200) {
        setAlert({
          type: 'danger',
          message: res.message,
          open: true,
        });
      } else {
        setAlert({
          type: 'success',
          message: res.message,
          open: true,
        });

        router.push('/authentication/login');
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
        <h2 className='text-2xl font-bold mb-4 text-center'>Register</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Name'
            name='name'
            placeholder='Enter your name'
            hint='Please provide your full name.'
            errors={errors.name}
            onChange={handleChange}
          />
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
            hint='Choose a strong password.'
            errors={errors.password}
            onChange={handleChange}
          />
          <TextField
            label='Phone'
            name='phone'
            type='tel'
            placeholder='Enter your phone number'
            errors={errors.phone}
            onChange={handleChange}
          />
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            Register
          </button>
        </form>
      </Paper>
    </main>
  );
}
