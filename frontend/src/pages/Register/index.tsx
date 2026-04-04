import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import { useState } from 'react';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';
import { register } from '../../api/auth/register';

export default function Register() {
    const [showRegisterPassword, setRegisterShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [shake, setShake] = useState(false)

    async function handleRegister() {
        const newErrors: Record<string, string> = {}
        if(!email) newErrors.email = 'Email is required';
        if(!username) newErrors.username = 'Username is required'
        if(!password) newErrors.password = 'Password is required'
        if(!confirmPassword) newErrors.confirmPassword = 'Confirm password is required'
        if(confirmPassword && (confirmPassword !== password)) newErrors.confirmPassword = 'The confirm password and password are different';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setShake(true)
            setTimeout(() => setShake(false), 200)
            return
        }

        try {
        await register({
            email: email,
            password: password,
            username: username,
            first_name: firstName,
            last_name: lastName
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
                    <p>Create Account</p>
                
                <div className={styles.inputGrid}>
                    <label htmlFor="RegisterEmail">Email <span className={styles.required}>*</span></label>
                    <input type="email" id="RegisterEmail" placeholder="Enter your email" required onChange={e => {setEmail(e.target.value); setErrors(prev => ({...prev, email: ''}))}} />
                    {errors.email && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.email}</span>}
                    <label htmlFor="RegisterUsername">Username <span className={styles.required}>*</span></label>
                    <input type="text" id="RegisterUsername" placeholder="Set a username" required onChange={e => {setUsername(e.target.value); setErrors(prev => ({...prev, username: ''}))}} />
                    {errors.username && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.username}</span>}
                    <div className={styles.nameContainer}>
                        <label htmlFor="RegisterFirstName">First Name </label>
                        <label htmlFor="RegisterLastName">Last Name </label>
                        <input type="text" id="RegisterFirstName" placeholder="Set your first name" onChange={e => {setFirstName(e.target.value)}} />
                        <input type="text" id="RegisterLastName" placeholder="Set your last name" onChange={e => {setLastName(e.target.value)}} />
                    </div>
                    <label htmlFor="RegisterPassword">Password <span className={styles.required}>*</span></label>
                    <div style={{position: 'relative'}}>
                        <input className={styles.showPasswordInput} type={showRegisterPassword ? "text" : "password"} id="RegisterPassword" placeholder="Enter a password" required onChange={e => {setPassword(e.target.value); setErrors(prev => ({...prev, password: ''}))}} />
                        <button className={styles.showPasswordButtons} onClick={() => setRegisterShowPassword(prev => !prev)}>{showRegisterPassword ? <EyeIcon size={18}/> : <EyeClosedIcon size={18}/>}</button>
                    </div>
                    {errors.password && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.password}</span>}
                    <label htmlFor="RegisterConfirmPassword">Confirm Password <span className={styles.required}>*</span></label>
                    <div style={{position: 'relative'}}>
                        <input className={styles.showPasswordInput} type={showConfirmPassword ? "text" : "password"} id="RegisterConfirmPassword" placeholder="Confirm your password" required onChange={e => {setConfirmPassword(e.target.value); setErrors(prev => ({...prev, confirmPassword: ''}))}} />
                        <button className={styles.showPasswordButtons} onClick={() => setConfirmShowPassword(prev => !prev)}>{showConfirmPassword ? <EyeIcon size={18}/> : <EyeClosedIcon size={18}/>}</button>
                    </div>
                    {errors.confirmPassword && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.confirmPassword}</span>}
                    {errors.non_field_errors && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{errors.non_field_erros}</span>}
                </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.createAccountButton} type='submit' onClick={handleRegister}>Create Account</button>
                    <button className={styles.accountButton}>Already have a account? <Link to='/'>Sign In</Link></button>
                </div>
            </main>
        </>
    )
}