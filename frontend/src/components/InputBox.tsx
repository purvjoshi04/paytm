type InputBoxProps = {
    label: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string 
}

export const InputBox = ({ label, placeholder, onChange, type }: InputBoxProps) => {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <input 
                placeholder={placeholder} 
                className="w-full px-2 py-1 border rounded" 
                onChange={onChange}
                type={type}
            />
        </div>
    )
}