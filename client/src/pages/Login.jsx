import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Успешный вход');
      navigate('/discover');
    } catch (err) {
      toast.error(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adam-container adam-pad-2 auth-wrap">
      <h1 className="adam-h1">Вход</h1>
      <p className="muted-text">
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
      <form onSubmit={onSubmit} className="form-col">
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
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="adam-btn">
          {loading ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
