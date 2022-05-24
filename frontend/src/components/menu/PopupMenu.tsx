import React, { useCallback, useEffect, useState, useRef } from "react";

interface PopupMenuProps {
    open?: boolean;
    mt?: string;
    children?: React.ReactNode;
}

function PopupMenu({ open = false, mt, children }: PopupMenuProps) {
    const [show, setShow] = useState<boolean>();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => setShow(open), [open]);

    const handleDocumentClick = useCallback(
        (ev: MouseEvent) => {
            if (!menuRef.current?.contains(ev.target as Node)) {
                setShow(false);
            } else if (show) {
                setShow(false);
            }
        },
        [show]
    );

    useEffect(() => {
        if (show) {
            document.body.addEventListener("click", handleDocumentClick);
        }
        return () => {
            document.body.removeEventListener("click", handleDocumentClick);
        };
    }, [show]);

    const baseCls =
        "bg-gray-900 border border-gray-700 rounded shadow-md mt-2 absolute top-0 right-0 min-w-full w-56 overflow-auto z-30 ";

    const cls = baseCls + (mt || " mt-10") + (show ? " " : " invisible");
    return (
        <div ref={menuRef} className={cls}>
            {children}
        </div>
    );
}

export default PopupMenu;
