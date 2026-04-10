
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/auth/login';
import { Register } from './pages/auth/register';
import { HomeLayout } from './pages/homeLayout';
import { VerifyEmail } from './pages/auth/verifyEmail';
import LandingPage from './pages/landingPage/landingPage';

const App = () => {
  return (
  <>

    <Routes>
      <Route path='/' element={<LandingPage />}/>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/home' element={<HomeLayout />}/>
      <Route path='/verify-email' element={<VerifyEmail />}/>
    </Routes>
  </>
  );
}

export default App
