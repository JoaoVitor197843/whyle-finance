import styles from './Hamburguer.module.css';

type Props = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default function Hamburguer({ isOpen, setIsOpen}: Props) {
    return (
        <button onClick={() => setIsOpen(!isOpen)} className={`${styles.hamburguerButton} ${isOpen ? styles.change : ""}`}>
            <div className={`${styles.hamburguerBars} ${styles.topBar}`}></div>
            <div className={`${styles.hamburguerBars} ${styles.middleBar}`}></div>
            <div className={`${styles.hamburguerBars} ${styles.bottomBar}`}></div>

        </button>
    )
}