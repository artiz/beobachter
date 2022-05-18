import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

test("renders learn react link", () => {
    render(<App />);
    const header = screen.getByText(process.env.REACT_APP_WEBSITE_NAME as string);
    expect(header).toBeInTheDocument();
});
