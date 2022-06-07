import React from "react";

interface InputProps {
    name?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
}

const Cmp = (props: InputProps) => {
    const { placeholder = "Search", onSearch } = props;
    const [query, setQuery] = React.useState<string>("");
    const inputCls =
        "w-full text-sm  bg-zinc-800 text-zinc-400 placeholder-zinc-600 transition border border-zinc-700 rounded py-1 px-2 pl-8 " +
        " outline-none focus:outline focus:outline-none focus:ring ";

    const handleSearch = React.useCallback(() => {
        if (query) {
            onSearch?.(query);
            setTimeout(() => setQuery(""), 100);
        }
    }, [query]);

    const handleChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(ev.target.value);
    }, []);

    const handleKeyup = React.useCallback(
        (ev: React.KeyboardEvent<HTMLInputElement>) => {
            if (ev.key === "Enter") {
                handleSearch();
            }
        },
        [handleSearch]
    );

    return (
        <div className="relative pull-right pl-4 pr-4 md:pr-0">
            <input
                type="search"
                value={query}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyUp={handleKeyup}
                className={inputCls}
            />
            <div onClick={handleSearch} className="absolute cursor-pointer hover:bg-zinc-800 p-1 top-1 left-5 rounded">
                <svg
                    className="fill-current pointer-events-none text-zinc-500 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                </svg>
            </div>
        </div>
    );
};

Cmp.displayName = "SearchBox";

export default Cmp;
