interface field {
    name: string;
    value: string;
    message: string;
}
export function handleErrors(
fields: field[]) {
    const newErrors: Record<string, string> = {};   
    fields.forEach((field) => {
        if(!field.value?.trim()) newErrors[field.name] = field.message;
    })
    return newErrors
}