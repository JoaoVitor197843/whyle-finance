
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import { Home } from './pages/home';
import { VerifyEmail } from './pages/auth/verifyEmail';


function App() {
  return (
  <>

    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<Home />}/>
      <Route path='/verify-email' element={<VerifyEmail />}/>
    </Routes>
  </>
  );
}

export default App
