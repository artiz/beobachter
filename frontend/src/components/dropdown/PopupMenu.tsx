import React, { useCallback, useEffect, useState, useRef } from "react";

interface PopupMenuProps {
    open?: boolean;
    mt?: string;
    children?: React.ReactNode;
}

// TODO: refactor with opperjs/core@2.9.1
// https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/dropdown
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
        "bg-zinc-900 border border-zinc-700 rounded shadow-md mt-2 absolute top-0 right-0 min-w-full w-56 overflow-auto z-30 ";

    const cls = baseCls + (mt || " mt-10") + (show ? " " : " invisible");
    return (
        <div ref={menuRef} className={cls}>
            {children}
        </div>
    );
}

export default PopupMenu;
