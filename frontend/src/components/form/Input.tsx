import React from "react";

interface InputProps {
    label: string;
    value?: string;
    name?: string;
    placeholder?: string;
    error?: string;
    groupCls?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    setter?: (val: string) => void;
    type?: string;
}

function Input({
    label,
    name,
    error,
    value,
    placeholder,
    groupCls = "mb-2",
    setter,
    onChange,
    type = "text",
}: InputProps) {
    const inputCls =
        "shadow appearance-none border rounded w-full " +
        " py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline " +
        (error ? " border-red-500 " : " border-gray-300 ");

    const handleChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setter?.(ev.target.value);
            onChange?.(ev);
        },
        [setter, onChange]
    );

    return (
        <div className={groupCls}>
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={name}>
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                className={inputCls}
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    );
}

export default Input;
