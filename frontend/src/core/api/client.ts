import config from "core/config";
import jwtDecode, { JwtPayload } from "jwt-decode";
import * as moment from "moment";

interface ApiTokenResponse {
    access_token: string;
    token_type: string; // "bearer"
}

const API_TOKEN_KEY = "auth_token";

export class AuthenticationException extends Error {
    constructor(public message: string = "Authentication error") {
        super(message);

        this.name = "AuthenticationException";
        Error.captureStackTrace(this, AuthenticationException);
    }
}

export class AuthTokenExpiredException extends AuthenticationException {
    constructor(public message: string = "Authentication token expired") {
        super(message);

        this.name = "AuthTokenExpiredException";
        Error.captureStackTrace(this, AuthTokenExpiredException);
    }
}

export type JsonResponse<T = unknown> = { data: T; response: Response };

export class APIClient {
    // ----- Authentication & User Operations

    // Authenticate the user with the backend services.
    async login(username: string, password: string) {
        localStorage.removeItem(API_TOKEN_KEY);

        // Emulate login form
        const form = new FormData();
        const item: Record<string, string> = { grant_type: "password", username, password };
        for (const key in item) {
            form.append(key, item[key].toString());
        }

        const response = await this.post<ApiTokenResponse>("/auth/login", form, {});

        localStorage.setItem(API_TOKEN_KEY, response.data.access_token);
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
    }: {
        url: string;
        method: string;
        body?: BodyInit;
        headers?: Record<string, string>;
    }): Promise<JsonResponse<T>> {
        try {
            const response = await fetch(config.apiBasePath + url, this.prepareRequest({ method, body, headers }));
            const data = (await response.json()) as T;

            return {
                data,
                response,
            };
        } catch (e) {
            console.error("REQ ERR", e);
            throw e;
        }
    }

    async get<T = unknown>(url: string, headers: Record<string, string> = {}): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "get", headers });
    }

    async post<T = unknown>(
        url: string,
        body: BodyInit,
        headers: Record<string, string> = {}
    ): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "post", body, headers });
    }

    private prepareRequest({
        method = "get",
        json = true,
        body,
        headers = {},
    }: { method?: string; json?: boolean; body?: BodyInit; headers?: Record<string, string> } = {}): RequestInit {
        const authToken = localStorage.getItem(API_TOKEN_KEY);

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
        };

        if (authToken) {
            const decodedToken = jwtDecode<JwtPayload>(authToken);
            if (decodedToken.exp) {
                const isTokenValid = moment.unix(decodedToken.exp).isAfter(moment.utc());
                if (isTokenValid) {
                    request.headers["Authorization"] = `bearer ${authToken}`;
                } else {
                    throw new AuthTokenExpiredException("Login session has expired");
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
