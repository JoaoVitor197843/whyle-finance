import { ThemeContext } from '../../ThemeContext';
import styles from './ToggleButton.module.css';
import { useContext  } from 'react';

export default function ToggleButton() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("ThemeContext need a Provider")
    }
    const { theme, setTheme } = context
    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={styles.toggleButton}>
            <div className={`${styles.circle} ${theme === 'light' ? styles.circleLight : ""}`}></div>
        </button>
    )
}