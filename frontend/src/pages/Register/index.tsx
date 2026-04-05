import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import { useState } from 'react';
import { register } from '../../api/auth/register';
import { handleErrors } from '../../utils/handleErrors';
import { InputForm } from '../../components/InputForm';
import { DoubleInputForm } from '../../components/doubleInputForm';

export default function Register() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');   
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [shake, setShake] = useState(false)

    async function handleRegister() {
        const newErrors = handleErrors([
        {name: 'email', value: email, message: 'Email is required'},
        {name: 'username', value: username, message: 'Username is required'},
        {name: 'password', value: password, message: 'Password is required'},
        {name: 'confirmPassword', value: confirmPassword, message: 'Confirm password is required'}]);
        if(confirmPassword && (confirmPassword !== password)) {
            newErrors.confirmPassword = 'The confirm password and password are different';
        }
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
            ...(firstName && {first_name: firstName}),
            ...(lastName && {last_name: lastName})
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
                    <InputForm labelText='Email' id='email' placeholder='Set your email' setChange={setEmail} setError={setErrors} error={errors.email} shake={shake} required={true}/>
                    <InputForm labelText='Username' id='username' placeholder='Set your username' setChange={setUsername} setError={setErrors} error={errors.username} shake={shake} required={true}/>
                    <DoubleInputForm inputs={[
                        {labelText: 'First Name', id: 'firstname', input_type: 'text', placeholder: 'Set your first name', setChange: setFirstName}, 
                        {labelText: 'Last Name', id: 'lastName', input_type: 'text', placeholder: 'Set your last name', setChange: setLastName}]} shake={shake}/>
                    <InputForm labelText='Password' id='password' placeholder='Set your password' setChange={setPassword} setError={setErrors} error={errors.password} shake={shake} input_type='password' required={true}/>
                    <InputForm labelText='Confirm Password' id='confirmPassword' placeholder='Confirm your password' setChange={setConfirmPassword} setError={setErrors} error={errors.confirmPassword} shake={shake} input_type='password' required={true}/>
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