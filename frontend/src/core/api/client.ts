import config from "core/config";
import { sendNotification, formatAuthError, formatError } from "core/hooks/useAppNotifier";
import jwtDecode, { JwtPayload } from "jwt-decode";
import * as moment from "moment";

interface ApiTokenResponse {
    access_token: string;
    token_type: string; // "bearer"
}

export const API_TOKEN = "auth_token";

export class AuthenticationError extends Error {
    code: number;

    constructor(public message: string = "Authentication error", code = 0) {
        super(message);

        this.name = "AuthenticationException";
        this.code = code;
        Error.captureStackTrace(this, AuthenticationError);
    }

    static fromCode(code: number): AuthenticationError {
        if (code === 401) {
            return new AuthenticationError("Invalid credentials", code);
        } else if (code === 403) {
            return new AuthenticationError("Not enough permissions", code);
        } else {
            return new AuthenticationError("Authentication error", code);
        }
    }
}

export class AuthTokenExpiredError extends AuthenticationError {
    constructor(public message: string = "Authentication token expired") {
        super(message);

        this.name = "AuthTokenExpiredException";
        Error.captureStackTrace(this, AuthTokenExpiredError);
    }
}

export class JsonResponse<T = unknown> extends Response {
    data: T;

    constructor(d: T) {
        super();

        this.data = d;
    }
}

export interface ApiOptions {
    skipAuthCheck?: boolean;
    skipStatusCheck?: boolean;
}

export class APIClient {
    // ----- Authentication & User Operations

    // Authenticate the user with the backend services.
    async login(username: string, password: string) {
        localStorage.removeItem(API_TOKEN);

        // Emulate login form
        const form = new FormData();
        const item: Record<string, string> = { grant_type: "password", username, password };
        for (const key in item) {
            form.append(key, item[key].toString());
        }

        const response = await this.post<ApiTokenResponse>("/auth/login", form, {}, { skipAuthCheck: true });

        if (response.data?.access_token) {
            localStorage.setItem(API_TOKEN, response.data?.access_token);
            window.postMessage(API_TOKEN);
        }
        return response;
    }

    //
    // Basic API interaction functionality
    //
    async exec<T = unknown>({
        url,
        method,
        body,
        headers = {},
        options = {},
    }: {
        url: string;
        method: string;
        body?: BodyInit;
        headers?: Record<string, string>;
        options: ApiOptions;
    }): Promise<JsonResponse<T>> {
        const response = await fetch(config.apiBasePath + url, this.prepareRequest({ method, body, headers }));

        const result = response as JsonResponse<T>;
        if (response.headers.get("content-type")?.includes("json")) {
            result.data = (await response.json()) as T;
        }

        if (!options.skipAuthCheck) {
            if ([401, 403].includes(response.status)) {
                sendNotification(formatAuthError(AuthenticationError.fromCode(response.status)));
            }
        }
        if (!options.skipStatusCheck) {
            if (response.status > 499) {
                sendNotification(formatError(`${response.statusText || "Server error"} ${response.status}`));
            } else if (response.status > 399) {
                sendNotification(formatError(`${response.statusText || "Request error"} ${response.status}`));
            }
        }

        return result;
    }

    async get<T = unknown>(
        url: string,
        headers: Record<string, string> = {},
        options: ApiOptions = {}
    ): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "get", headers, options });
    }

    async post<T = unknown>(
        url: string,
        body: BodyInit,
        headers: Record<string, string> = {},
        options: ApiOptions = {}
    ): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "post", body, headers, options });
    }

    private prepareRequest({
        method = "get",
        json = true,
        body,
        headers = {},
    }: { method?: string; json?: boolean; body?: BodyInit; headers?: Record<string, string> } = {}): RequestInit {
        const authToken = localStorage.getItem(API_TOKEN);

        if (json) {
            // support form, multipart request
            if (typeof body === "string") {
                headers["Content-Type"] = "application/json;charset=UTF-8";
            }

            headers["Accept"] = "application/json";
        }

        const request = {
            method,
            headers,
            body,
            credentials: "include" as RequestCredentials,
            mode: "cors" as RequestMode,
        };

        if (authToken) {
            const decodedToken = jwtDecode<JwtPayload>(authToken);
            if (decodedToken.exp) {
                const isTokenValid = moment.unix(decodedToken.exp).isAfter(moment.utc());
                if (isTokenValid) {
                    request.headers["Authorization"] = `bearer ${authToken}`;
                } else {
                    throw new AuthTokenExpiredError("Login session has expired");
                }
            }
        }

        return request;
    }

    // fetchUser() {
    //     return this.apiClient.get("/auth/me").then(({ data }) => {
    //         localStorage.setItem("user", JSON.stringify(data));
    //         return data;
    //     });
    // }

    // register(email, password, fullName) {
    //     const loginData = {
    //         email,
    //         password,
    //         full_name: fullName,
    //         is_active: true,
    //     };

    //     return this.apiClient.post("/auth/signup", loginData).then((resp) => {
    //         return resp.data;
    //     });
    // }

    // // Logging out is just deleting the jwt.
    // logout() {
    //     // Add here any other data that needs to be deleted from local storage
    //     // on logout
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("user");
    // }
}
