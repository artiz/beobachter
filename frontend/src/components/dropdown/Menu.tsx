// copied from https://floating-ui.com/docs/react-dom-interactions#examples
// MIT license
import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useState } from "react";

import {
    useFloating,
    offset,
    flip,
    shift,
    useListNavigation,
    useHover,
    useTypeahead,
    useInteractions,
    useRole,
    useClick,
    useDismiss,
    autoUpdate,
    safePolygon,
    FloatingPortal,
    useFloatingTree,
    useFloatingNodeId,
    useFloatingParentNodeId,
    FloatingNode,
    FloatingTree,
    FloatingFocusManager,
} from "@floating-ui/react-dom-interactions";

import mergeRefs from "react-merge-refs";
import { ThailwindColorStr } from "ui/thailwind";

export interface MenuProps {
    label?: string;
    itemContent?: React.ReactNode;
    inline?: boolean;
    nested?: boolean;
    width?: string;
    color?: ThailwindColorStr;
    hovercolor?: ThailwindColorStr;
    children?: React.ReactNode;
}

export const MenuComponent = forwardRef<HTMLButtonElement, MenuProps & React.HTMLProps<HTMLButtonElement>>(
    ({ children, label, itemContent, inline, color = "zinc", hovercolor, width = "min-w-[6rem]", ...props }, ref) => {
        const [open, setOpen] = useState(false);
        const [activeIndex, setActiveIndex] = useState<number | null>(null);
        const [allowHover, setAllowHover] = useState(false);

        if (!hovercolor) {
            if (color.includes(":")) {
                [color, hovercolor] = color.split(":") as ThailwindColorStr[];
            } else {
                hovercolor = color;
            }
        }
        const {} = props;
        const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);

        const tree = useFloatingTree();
        const nodeId = useFloatingNodeId();
        const parentId = useFloatingParentNodeId();
        const nested = parentId != null;

        const { x, y, reference, floating, strategy, refs, context } = useFloating<HTMLButtonElement>({
            open,
            onOpenChange: setOpen,
            middleware: [offset({ mainAxis: 4, alignmentAxis: nested ? -5 : 0 }), flip(), shift()],
            placement: nested ? "right-start" : "bottom-start",
            nodeId,
            whileElementsMounted: autoUpdate,
        });

        const listContentRef = useRef(
            Children.map(children, (child) => (isValidElement(child) ? child.props.label : null)) as Array<
                string | null
            >
        );

        const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
            useHover(context, {
                handleClose: safePolygon({ restMs: 25 }),
                enabled: nested && allowHover,
            }),
            useClick(context, {
                toggle: !nested,
                pointerDown: true,
                ignoreMouse: nested,
            }),
            useRole(context, { role: "menu" }),
            useDismiss(context),
            useListNavigation(context, {
                listRef: listItemsRef,
                activeIndex,
                nested,
                onNavigate: setActiveIndex,
            }),
            useTypeahead(context, {
                listRef: listContentRef,
                onMatch: open ? setActiveIndex : undefined,
                activeIndex,
            }),
        ]);

        // Event emitter allows you to communicate across tree components.
        // This effect closes all menus when an item gets clicked anywhere in the tree.
        useEffect(() => {
            function onTreeClick() {
                setOpen(false);
                if (parentId === null) {
                    refs.reference.current?.focus();
                }
            }

            tree?.events.on("click", onTreeClick);
            return () => {
                tree?.events.off("click", onTreeClick);
            };
        }, [parentId, tree, refs]);

        // Determine if "hover" logic can run based on the modality of input.
        // This prevents unwanted focus synchronization as menus open and close with
        // keyboard navigation and the cursor is resting on the menu.
        useEffect(() => {
            function onPointerMove() {
                setAllowHover(true);
            }

            function onKeyDown() {
                setAllowHover(false);
            }

            window.addEventListener("pointermove", onPointerMove, {
                once: true,
                capture: true,
            });
            window.addEventListener("keydown", onKeyDown, true);
            return () => {
                window.removeEventListener("pointermove", onPointerMove, {
                    capture: true,
                });
                window.removeEventListener("keydown", onKeyDown, true);
            };
        }, [allowHover]);

        const mergedReferenceRef = useMemo(() => mergeRefs([ref, reference]), [reference, ref]);

        // Style the menu based on the color and width props.
        const rootCls = useMemo(
            () =>
                `${width} inline-block rounded shadow text-${color}-100 z-20 ` +
                (inline
                    ? `  `
                    : ` m-0 py-2 px-4 border bg-${color}-600 border-${color}-700 hover:border-${color}-600 hover:bg-${color}-500 active:bg-${color}-700 text-${color}-100
                        transition ease-in-out delay-10 `),
            [inline, hovercolor, color, width]
        );

        const menuCls = useMemo(
            () =>
                `p-0 ${width} inline-block rounded shadow text-${color}-100 border border-${color}-600 z-20 ` +
                (nested ? ` bg-${color}-900 ` : ` bg-${color}-900  `),
            [nested, open, hovercolor, color]
        );

        const menuItemCls = useMemo(
            () =>
                `m-0 py-2 px-4 text-sm flex justify-between w-full outline-none focus:outline rounded hover:bg-${hovercolor}-700`,
            [hovercolor, color, width]
        );

        const mergeProps = (
            elProps: React.HTMLProps<HTMLButtonElement>,
            propsToAdd: React.HTMLProps<HTMLButtonElement> = {}
        ) => {
            return Object.assign(elProps, propsToAdd);
        };

        return (
            <FloatingNode id={nodeId}>
                <button
                    {...getReferenceProps({
                        ...props,
                        ref: mergedReferenceRef,
                        // onClick: ({ currentTarget }) => (currentTarget as HTMLButtonElement).focus(),
                        ...(nested
                            ? {
                                  role: "menuitem",
                                  className: menuItemCls,
                                  color: "red",
                                  onKeyDown(event) {
                                      // Prevent more than one menu from being open.
                                      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                                          setOpen(false);
                                      }
                                  },
                              }
                            : { className: rootCls }),
                    })}
                >
                    {itemContent}
                    {label} {nested && <span className="ml-2">➔</span>}
                </button>
                <FloatingPortal>
                    {open && (
                        <FloatingFocusManager
                            context={context}
                            preventTabbing
                            modal={!nested}
                            // Touch-based screen readers will be able to navigate back to the
                            // reference and click it to dismiss the menu without clicking an item.
                            // This acts as a touch-based `Esc` key. A visually-hidden dismiss button
                            // is an alternative.
                            order={["reference", "content"]}
                        >
                            <div
                                {...getFloatingProps({
                                    className: menuCls,
                                    ref: floating,
                                    style: {
                                        position: strategy,
                                        top: y ?? "",
                                        left: x ?? "",
                                    },
                                })}
                            >
                                {/*  */}

                                {Children.map(
                                    children,
                                    (child, index) =>
                                        isValidElement(child) &&
                                        cloneElement(
                                            child,
                                            mergeProps(
                                                getItemProps({
                                                    role: "menuitem",
                                                    className: menuItemCls,
                                                    ref(node: HTMLButtonElement) {
                                                        listItemsRef.current[index] = node;
                                                    },
                                                    // By default `focusItemOnHover` uses `pointermove` sync,
                                                    // but when a menu closes we want this to sync it on
                                                    // `enter` even if the cursor didn't move.
                                                    onPointerEnter() {
                                                        if (allowHover) {
                                                            setActiveIndex(index);
                                                        }
                                                    },
                                                }),
                                                {
                                                    color: color + (hovercolor ? `:${hovercolor}` : ""),
                                                    width,
                                                    onClick: (evt: React.MouseEvent<HTMLButtonElement>) => {
                                                        child.props?.onClick?.(evt);
                                                        tree?.events.emit("click");
                                                    },
                                                }
                                            )
                                        )
                                )}
                            </div>
                        </FloatingFocusManager>
                    )}
                </FloatingPortal>
            </FloatingNode>
        );
    }
);

MenuComponent.displayName = "MenuComponent";

export const Menu = forwardRef<HTMLButtonElement, MenuProps & React.HTMLProps<HTMLButtonElement>>((props, ref) => {
    const parentId = useFloatingParentNodeId();
    if (parentId == null) {
        return (
            <FloatingTree>
                <MenuComponent {...props} ref={ref} />
            </FloatingTree>
        );
    }

    return <MenuComponent {...props} ref={ref} />;
});

Menu.displayName = "MenuComponent";
