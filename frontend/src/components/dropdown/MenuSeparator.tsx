import React, { forwardRef } from "react";

interface Props {
    color?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Cmp = forwardRef<HTMLAnchorElement, Props>(({ color }, ref) => {
    if (color?.includes(":")) {
        color = color.split(":")[0];
    }
    return <hr className={`my-0 border-t border-${color}-600`} />;
});

Cmp.displayName = "MenuSeparator";
export default Cmp;
