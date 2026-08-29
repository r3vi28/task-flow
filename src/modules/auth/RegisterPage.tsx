import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { register as authRegister } from './authService';
import { useAuth } from './AuthContext';
import logo from '../../assets/logo.png';

const schema = z.object({
  name: z.string().nonempty({ message: 'El nombre no puede estar vacío' }),
  email: z.string().email({ message: 'Formato de email inválido' }),
  password: z.string().min(6, { message: 'Contraseña mínima 6 caracteres' }),
});

type RegisterForm = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [values, setValues] = useState<RegisterForm>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string>('');

  useEffect(() => {
    if (authUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [authUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(values);
    if (!res.success) {
      const fieldErrors: Record<string, string> = {};
      res.error.issues.forEach(err => {
        const key = err.path[0] as string;
        if (key) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setGeneralError('');
    try {
      await authRegister(res.data);
      navigate('/login', { replace: true });
    } catch (err: any) {
      setGeneralError(err?.response?.data?.message || 'Error al registrar. Por favor, inténtalo de nuevo');
    }
  };

  return (
    <main className="auth-page"><form onSubmit={handleSubmit} noValidate className="auth-card">
      <img className="auth-logo" src={logo} alt="Task Flow" />
      <h1 className="auth-title">Crea tu cuenta</h1><p className="auth-copy">Organiza tu trabajo en un solo lugar.</p>
      <div className="field">
        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="input"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>
      <div className="field mt-4">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="input"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>
      <div className="field mt-4">
        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="input"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>
      {generalError && <p className="form-error mt-4">{generalError}</p>}
      <button
        type="submit"
        className="btn btn-primary mt-6 w-full"
      >
        Registrarse
      </button>
      <p className="mt-5 text-sm text-slate-500">
        ¿Ya tienes cuenta? <Link className="font-semibold text-blue-700 hover:underline" to="/login">Inicia sesión</Link>
      </p>
    </form></main>
  );
};
