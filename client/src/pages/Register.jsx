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
    <div className="adam-container" style={{ maxWidth: 420, padding: '2rem 0' }}>
      <h1 className="adam-h1">Регистрация</h1>
      <p style={{ color: 'var(--adam-muted)' }}>
        Уже есть аккаунт? <Link to="/login">Вход</Link>
      </p>
      <form onSubmit={onSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span>Имя</span>
          <input className="adam-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span>Email</span>
          <input className="adam-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
        <button type="submit" className="adam-btn" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Создание…' : 'Создать аккаунт'}
        </button>
      </form>
    </div>
  );
}
