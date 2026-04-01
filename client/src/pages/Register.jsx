import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success('Регистрация успешна');
      navigate('/discover');
    } catch (err) {
      toast.error(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adam-container adam-pad-2 auth-wrap">
      <h1 className="adam-h1">Регистрация</h1>
      <p className="muted-text">
        Уже есть аккаунт? <Link to="/login">Вход</Link>
      </p>
      <form onSubmit={onSubmit} className="form-col">
        <label className="label-col">
          <span>Имя</span>
          <input className="adam-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="label-col">
          <span>Эл. почта</span>
          <input className="adam-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="label-col">
          <span>Пароль</span>
          <input
            className="adam-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="adam-btn" disabled={loading}>
          {loading ? 'Создание…' : 'Создать аккаунт'}
        </button>
      </form>
    </div>
  );
}
