import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/auth/login';
import { Register } from './pages/auth/register';
import { HomeLayout } from './pages/home/homeLayout';
import { VerifyEmail } from './pages/auth/verifyEmail';
import LandingPage from './pages/landingPage/landingPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomeInit from './pages/home/homeInit';
import Logout from './pages/auth/logout';
import HomeTransactions from './pages/home/homeTransactions';
import ForgotPassword from './pages/auth/forgotPassword';
import ResetPassword from './pages/auth/resetPassword';
import { AuthProvider } from './context/AuthContext.tsx';
import UserInformation from './pages/user/userInformation.tsx';
import { api } from './api/apiConnect.ts';
import { useEffect } from 'react';
import getCSRFToken from './utils/getCSRFToken.ts';

const App = () => {
  useEffect(() => {
    const get_csrf = async () => {
      if(!getCSRFToken()) {
        await api.get('csrf/')
      }
    }
    void get_csrf();
  }, [])
  return (
  <>

    <Routes>
      <Route path='/' element={<LandingPage />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>
      <Route path='/reset-password' element={<ResetPassword />}/>
      <Route element={<AuthProvider><ProtectedRoute type={false}/></AuthProvider>}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-email' element={<VerifyEmail />}/>
      </Route>
      <Route element={<AuthProvider><ProtectedRoute type/></AuthProvider>}>
        <Route path='/logout' element={<Logout />}/>
        <Route path='user' element={<UserInformation />}/>
        <Route path='/home' element={<HomeLayout />}>
          <Route index element={<HomeInit />}/>
          <Route path='transactions' element={<HomeTransactions />}/>
        </Route>
      </Route>
    </Routes>
  </>
  );
}

export default App
