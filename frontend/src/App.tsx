import NavBar from './components/navbar';
import { useEffect, useState } from 'react';
import styles from './App.module.css';
import { ThemeContext } from './ThemeContext';
import type { Theme } from './ThemeContext';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [theme, setTheme] = useState<Theme>('light')
  const [openTab, setTab] = useState<number | null>(null)
  useEffect(() => {
    document.body.className = theme}, [theme])
  function OpenNavBar() {
    if(openTab) {
      setTab(null);
    } else {
      setIsOpen(prev => !prev)
    }
  }
  return (
  <>
    <ThemeContext.Provider value = {{ theme, setTheme }}>
    {isOpen && <div onClick={OpenNavBar} className={styles.overlay}></div>}
    <NavBar isOpen={isOpen} setIsOpen={setIsOpen} openTab={openTab} setTab={setTab}/>
    </ThemeContext.Provider>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  </>
  );
}

export default App
