import NavBar from './components/navbar/NavBar';
import { useEffect, useState } from 'react';
import styles from './App.module.css';
import { ThemeContext } from './ThemeContext';

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.body.className = theme}, [theme])
  return (
    <>
    <ThemeContext value = {{ theme, setTheme }}>
      {isOpen && <div onClick={() => setIsOpen(!isOpen)} className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}></div>}

      <NavBar isOpen={isOpen} setIsOpen={setIsOpen}/>
    </ThemeContext>
    </>
  );
}

export default App
