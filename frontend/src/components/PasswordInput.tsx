// components/PasswordInput.tsx
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

type PasswordInputProps = {
    label: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput = ({ label, placeholder, onChange }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <div className="relative">
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder} 
                    className="w-full px-2 py-1 border rounded pr-10" 
                    onChange={onChange}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeClosed className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    )
}