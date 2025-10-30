import type { ReactNode } from "react";

type InputBoxProps = {
    label: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    icon?: ReactNode;
}

export const InputBox = ({
    label,
    placeholder,
    onChange,
    type = "text",
    icon
}: InputBoxProps) => {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full px-2 py-1 border rounded ${icon ? 'pr-10' : ''}`}
                    onChange={onChange}
                />
                {icon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}