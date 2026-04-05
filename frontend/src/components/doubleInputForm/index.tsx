import styles from './doubleInputForm.module.css';
type Input = {
    labelText: string;
    id: string;
    input_type: React.HTMLInputTypeAttribute;
    placeholder: string;
    setChange: React.Dispatch<React.SetStateAction<string>>;
    error?: string;
}

type RequiredInput = Input & (
    | {
        required: true;
        setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    }
    | {
        required?: false;
        setError?: never;
    }
)
interface Props {
    inputs: [RequiredInput, RequiredInput]
    shake: boolean
}
export function DoubleInputForm({inputs, shake}: Props) {
    const first_input = inputs[0];
    const second_input = inputs[1];
    function Change(element_number: number, change: React.ChangeEvent<HTMLInputElement>) {
        inputs[element_number].setChange(change.target.value);
        if(inputs[element_number].setError) {
        inputs[element_number].setError(prev => ({...prev, [inputs[element_number].id]: ''}))
        }
    }
    return (
        <div className={styles.container} style={!first_input.required || !second_input.required ? {paddingBottom: '14px'} : undefined}>
            <label htmlFor={first_input.id}>{first_input.labelText}</label>
            <label htmlFor={second_input.id}>{second_input.labelText}</label>
            <input type={first_input.input_type} placeholder={first_input.placeholder} onChange={change => Change(0, change)}/>
            <input type={second_input.input_type} placeholder={second_input.placeholder} onChange={change => Change(1, change)}/>
            {first_input.required && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{first_input.error}</span>}
            {second_input.required && <span className={`${styles.error} ${shake ? styles.shake : ''}`}>{second_input.error}</span>}
        </div>
    )
}