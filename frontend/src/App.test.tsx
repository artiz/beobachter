import React from "react";

import { render, screen } from "@testing-library/react";
import App from "./App";
import WS from "jest-websocket-mock";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

let ws: WS;
beforeEach(() => {
    ws = new WS("ws://localhost:8000/api/ws");
});
afterEach(() => {
    WS.clean();
});

test("renders learn react link", () => {
    render(<App />);
    const header = screen.getAllByText(process.env.REACT_APP_WEBSITE_NAME as string)[0];
    expect(header).toBeInTheDocument();
    ws.close();
});
