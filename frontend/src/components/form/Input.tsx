import React from "react";

interface InputProps {
    label: string;
    value: string;
    name?: string;
    placeholder?: string;
    error?: string;
    groupCls?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    type?: string;
}

function Input({
    label,
    name,
    error,
    value,
    placeholder,
    groupCls = "mb-2",
    onChange = undefined,
    type = "text",
}: InputProps) {
    const inputCls =
        "shadow appearance-none border border-red-500 rounded w-full" +
        "py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline " +
        (error ? "border-red-500" : "border-teal-500");

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
                onChange={onChange}
                className={inputCls}
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    );
}

export default Input;
