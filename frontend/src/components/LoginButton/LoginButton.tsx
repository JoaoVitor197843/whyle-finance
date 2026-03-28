import styles from './LoginButton.module.css';

type Props = {
    isOpen: boolean
}
export default function LoginButton({ isOpen }: Props) {
    return (
        <button className={`${styles.loginButton} ${isOpen ? styles.open : ""}`}>
            <strong>Login</strong>
        </button>
    )
}