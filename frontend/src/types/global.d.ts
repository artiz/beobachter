/* eslint-disable no-var */

class ServerData {
    apiBasePath: string;
    wsBasePath: string;
}

declare global {
    var SERVER_DATA: ServerData;
}

export {};
