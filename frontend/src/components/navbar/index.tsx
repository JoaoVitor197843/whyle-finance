import ToggleButton from '../dark_mode';
import Hamburguer from '../hamburguer';
import LoginButton from '../LoginButton';
import styles from './NavBar.module.css';
import { SelectButtons } from '../SelectButtons';
import { useEffect } from 'react';

type OpenTab = number | null;

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    openTab: OpenTab;
    setTab: React.Dispatch<React.SetStateAction<OpenTab>>;
}

export default function NavBar({ isOpen, setIsOpen, openTab, setTab }: Props) {
    
    useEffect(() => {
    if(!isOpen) {
        setTab(null)
    }
    }, [isOpen])
    return (
        <nav className={`${styles.navBar} ${isOpen ? styles.open : ""}`}>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Hamburguer isOpen={isOpen} setIsOpen={setIsOpen}/>
                    {isOpen && <SelectButtons id={1} title='Menu' links={[{title: 'SAIBA MAIS', url: 'http://localhost:5173'}, {title: 'O QUE SOMOS?', url: 'http://localhost:5173'}, {title: 'CONTATOS', url: 'http://localhost:5173'}, {title: 'SUPORTE', url: 'http://localhost:5173'}, {title: 'BACANA', url: 'http://localhost:5173'}, {title: 'TESTE1', url: 'http://localhost:5173'}, {title: 'TESTE2', url: 'http://localhost:5173'}, {title: 'TESTE3', url: 'http://localhost:5173'}, {title: 'TESTE4', url: 'http://localhost:5173'}]} openTab={openTab} setTab={setTab}/>}
                </div>
                {isOpen && <LoginButton/>}
                {!isOpen && <ToggleButton/>}
            </div>
        </nav>
    )
}