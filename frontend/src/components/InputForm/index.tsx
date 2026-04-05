import { useState } from "react";
import styles from "./InputForm.module.css";
import { EyeIcon, EyeClosedIcon } from 'lucide-react';

type Input = {
    labelText: string;
    id: string;
    input_type?: React.HTMLInputTypeAttribute;
    placeholder: string;
    setChange: React.Dispatch<React.SetStateAction<string>>;
    shake: boolean;
    error?: string;
}

type InputProps = Input & (
    | {
        required: true;
        setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    }
    | {
        required?: false;
        setError?: never;
    }
)

export function InputForm({ labelText, id, placeholder, setChange, setError, error, shake, input_type = "text", required = false}: InputProps) {
    function Change(change: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        setChange(change.target.value);
        if(setError) {
        setError(prev => ({...prev, [id]: ''}))
        }
    }   
    const [toggle, setToggle] = useState(false);
    function InputType() {
        if (input_type == "password") {
            if(!toggle) {
                return "password"
            }
            return "text"
        }
        return input_type
    }
    return (
        <>
            <label htmlFor={id}>{labelText} {required && <span style={{color: 'red'}}>*</span>}</label>
            <div style={input_type == "password" ? {position: 'relative'} : undefined}>
            <input className={input_type == 'password' ? styles.passwordInput : ''} type={InputType()} id={id} placeholder={placeholder} onChange={change => {Change(change)}} />
            {input_type == "password" && <button className={styles.toggle} onClick={() => setToggle(prev => !prev)}>{toggle ? <EyeIcon size={18}/> : <EyeClosedIcon size={18}/>}</button>}
            </div>
            {required && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{error}</span>}
        </>
    )
}