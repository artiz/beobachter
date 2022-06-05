import React from "react";

interface InputProps {
    label: string;
    value?: string;
    name?: string;
    placeholder?: string;
    error?: string;
    groupCls?: string;
    readOnly?: boolean;
    required?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    setter?: (value: string, name?: string) => void;
    type?: string;
}

const Input = React.forwardRef((props: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
        label,
        name,
        error,
        value,
        placeholder,
        groupCls = "mb-2",
        readOnly = false,
        required = false,
        setter,
        onChange,
        type = "text",
    } = props;
    const inputCls =
        "shadow appearance-none border rounded w-full " +
        " py-2 px-3 placeholder-zinc-900 mb-3 leading-tight outline-none focus:outline focus:outline-none focus:ring " +
        (readOnly ? " text-zinc-600 bg-zinc-200 " : " text-zinc-700 bg-white ") +
        (error ? " border-red-500 " : " border-zinc-300 ");

    const handleChange = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setter?.(ev.target.value, name);
            onChange?.(ev);
        },
        [setter, onChange, name, error]
    );

    return (
        <div className={groupCls}>
            {label && (
                <label className="block text-zinc-700 text-sm font-bold mb-1" htmlFor={name}>
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                defaultValue={value}
                placeholder={placeholder}
                onChange={handleChange}
                className={inputCls}
                readOnly={readOnly}
                required={required}
                ref={ref}
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
