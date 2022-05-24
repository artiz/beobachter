import { Dictionary } from "types/common";

const env = typeof process === "object" ? process.env : ({} as Dictionary<string>);
const publicUrl = env.PUBLIC_URL || SERVER_DATA.publicUrl || "";

const config = {
    apiBasePath: SERVER_DATA.apiBasePath,
    wsBasePath: SERVER_DATA.wsBasePath,
    publicUrl,
    appName: env.REACT_APP_WEBSITE_NAME || "Beobachter",
    reactAppMode: env.REACT_APP_MODE || "development",

    getPublicUrl: (path = "/"): string => publicUrl + path,
};

export default config;
