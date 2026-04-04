import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useState } from 'react';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import { login } from '../../api/auth/login';

export default function Login() {
    const [showLoginPassword, setLoginShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [shake, setShake] = useState(false)

    async function handleLogin() {
        const newErrors: Record<string, string> = {}
        if(!email) newErrors.email = 'Email is required';
        if(!password) newErrors.password = 'Password is required'
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setShake(true)
            setTimeout(() => setShake(false), 200)
            return
        }
        try {
        await login({
            email: email,
            password: password
        });
        } catch (error: any) {
            setErrors(error.response.data)
            setShake(true)
            setTimeout(() => setShake(false), 200)
        }
    }
    return (
        <>
            <main className={styles.main}>
                <div className={styles.topContainer}>
                    <p>Log in</p>
                    <div className={styles.inputGrid}>
                        <label htmlFor="LoginEmail">Email <span className={styles.required}>*</span></label>
                        <input type="email" id="LoginEmail" placeholder="Enter your email" required onChange={e => {setEmail(e.target.value); setErrors(prev => ({...prev, email: ''}))}}/>
                        {errors.email && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.email}</span>}
                        <label htmlFor="LoginPassword">Password <span className={styles.required}>*</span></label>
                        <div style={{position: 'relative'}}>
                        <input className={styles.showPasswordInput} type={showLoginPassword ? "text" : "password"} id="LoginPassword" placeholder="Enter a password" required onChange={e => {setPassword(e.target.value); setErrors(prev => ({...prev, password: ''}))}}/>
                        <button className={styles.showPasswordButtons} onClick={() => setLoginShowPassword(prev => !prev)}>{showLoginPassword ? <EyeIcon size={18}/> : <EyeClosedIcon size={18}/>}</button>
                    </div>
                    {errors.password && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.password}</span>}
                    {errors.non_field_errors && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.non_field_erros}</span>}
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.buttons} type='submit' onClick={handleLogin}>Login</button>
                    <button className={styles.accountButton}>Don't have a account? <Link to='/register'>Sign Up</Link></button>
                    <button className={styles.forgotButton}>Forgot password?</button>
                </div>
            </main>
        </>
    )
}