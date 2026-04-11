
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/auth/login';
import { Register } from './pages/auth/register';
import { HomeLayout } from './pages/home/homeLayout';
import { VerifyEmail } from './pages/auth/verifyEmail';
import LandingPage from './pages/landingPage/landingPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomeInit from './pages/home/homeInit';

const App = () => {
  return (
  <>

    <Routes>
      <Route path='/' element={<LandingPage />}/>
      <Route element={<ProtectedRoute type={false}/>}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute type/>}>
        <Route path='/home' element={<HomeLayout />}>
          <Route index element={<HomeInit />}/>
          <Route path='init' element={<HomeInit />}/>
        </Route>
        <Route path='/verify-email' element={<VerifyEmail />}/>
      </Route>
    </Routes>
  </>
  );
}

export default App
