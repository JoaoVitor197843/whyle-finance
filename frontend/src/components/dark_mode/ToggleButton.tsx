import { ThemeContext } from '../../ThemeContext';
import styles from './ToggleButton.module.css';
import { useContext,  } from 'react';

type Props = {
    isOpen: boolean
}

export default function ToggleButton({ isOpen }: Props) {
    const context = useContext(ThemeContext)
    if (!context) return null
    const { theme, setTheme } = context
    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`${styles.toggleButton} ${isOpen ? styles.change : ""}`}>
            <div className={`${styles.circle} ${theme ==='light' ? styles.circleLight : ""}`}></div>
        </button>
    )
}