import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { useState } from 'react';
import { login } from '../../api/auth/login';
import { InputForm } from '../../components/InputForm';

export default function Login() {
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
                        <InputForm labelText='Email' id='email' placeholder='Set your email' setChange={setEmail} setError={setErrors} error={errors.email} shake={shake} required={true}/>
                        <InputForm labelText='Password' id='password' placeholder='Set your password' setChange={setPassword} setError={setErrors} error={errors.password} shake={shake} input_type='password' required={true}/>
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