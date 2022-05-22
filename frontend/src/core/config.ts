import { Dictionary } from "types/common";

const env = typeof process === "object" ? process.env : ({} as Dictionary<string>);

const config = {
    apiBasePath: SERVER_DATA.apiBasePath,
    wsBasePath: SERVER_DATA.wsBasePath,
    publicUrl: env.PUBLIC_URL,
    appName: env.REACT_APP_WEBSITE_NAME || "Beobachter",
    reactAppMode: env.REACT_APP_MODE || "development",

    getPublicUrl: (path = "/"): string => env.PUBLIC_URL + path,
};

export default config;
