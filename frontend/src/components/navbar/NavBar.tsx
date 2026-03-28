import ToggleButton from '../dark_mode/ToggleButton';
import Hamburguer from '../hamburguer';
import LoginButton from '../LoginButton/LoginButton';
import styles from './NavBar.module.css';

type Props = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NavBar({ isOpen, setIsOpen }: Props) {
    
    return (
        <nav className={`${styles.navBar} ${isOpen ? styles.open : ""}`}>
            <Hamburguer isOpen={isOpen} setIsOpen={setIsOpen}/>
            <LoginButton isOpen={isOpen}/>
            <ToggleButton isOpen={isOpen}/>
        </nav>
    )
}