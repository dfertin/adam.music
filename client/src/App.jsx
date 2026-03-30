import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout.jsx';
import { PageLoader } from './components/PageLoader.jsx';
import { useAuth } from './context/AuthContext.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Album = lazy(() => import('./pages/Album.jsx'));
const LibraryPage = lazy(() => import('./pages/Library.jsx'));
const Artists = lazy(() => import('./pages/Artists.jsx'));
const ArtistDetail = lazy(() => import('./pages/ArtistDetail.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function LibraryGate() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <LibraryPage />
    </Suspense>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 254, 248, 0.95)',
            color: '#141312',
            border: '1px solid rgba(20,19,18,0.08)',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: '0.9rem',
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/discover" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/library" element={<LibraryGate />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
