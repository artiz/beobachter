import { useState, useEffect } from "react";

interface IBus {
    subscribe: (handler: (message: unknown) => void) => void;
    disconnect: () => void;
}

export function useBus() {
    const [bus] = useState<IBus>();

    useEffect(() => {
        // const connect: (IBus) => void = (b) => setBus(b);
        // TODO: load API from Context/Provider
        // API.subscribe(connect);
        return () => {
            if (bus) {
                // API.unsubscribe(bus);
            }
        };
    });

    return bus;
}
