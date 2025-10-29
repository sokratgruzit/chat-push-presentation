import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: React.ReactNode;
    containerId?: string;
    visible?: boolean;
}

export const Portal: React.FC<PortalProps> = ({
    children,
    containerId = "global-portal-root",
    visible = true,
}) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let el = document.getElementById(containerId);
        if (!el) {
            el = document.createElement("div");
            el.id = containerId;
            el.style.position = "relative";
            document.body.appendChild(el);
        }
        setContainer(el);
        return () => {
            if (el && el.parentNode === document.body) {
                // Можно не удалять, если используется глобально
                document.body.removeChild(el);
            }
        };
    }, [containerId]);

    if (!visible || !container) return null;

    return createPortal(children, container);
};
