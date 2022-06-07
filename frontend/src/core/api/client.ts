import config from "core/config";
import { sendNotification, formatError } from "core/hooks/useAppNotifier";
import { User, DbUser } from "core/models/user";
import jwtDecode, { JwtPayload } from "jwt-decode";
import * as moment from "moment";

interface ApiTokenResponse {
    access_token: string;
    token_type: string; // "bearer"
}

export const API_TOKEN = "auth_token";

export function isTokenNotExpired(token: JwtPayload) {
    if (!token.exp) {
        return;
    }

    return moment.unix(token.exp).isAfter(moment.utc());
}

export class HttpError extends Error {
    status: number;

    constructor(status: number, message = "HTTP error") {
        super(message);

        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class RequestError extends HttpError {
    constructor(status = 0, message = "Request error") {
        super(status, message);
    }
}

export class ServerError extends HttpError {
    constructor(status = 0, message = "Server error") {
        super(status, message);
    }
}

export class AuthenticationError extends RequestError {
    constructor(status: number, message?: string) {
        if (!message) {
            message = `Authentication error, status: ${status}`;
        }
        super(status, message);
    }

    static fromStatus(status: number): AuthenticationError {
        if (status === 401) {
            return new AuthenticationError(status, "Invalid user credentials");
        } else if (status === 403) {
            return new AuthenticationError(status, "Not enough permissions");
        } else {
            return new AuthenticationError(status, "Authentication error");
        }
    }
}

export class AuthTokenExpiredError extends AuthenticationError {
    constructor(public message: string = "Authentication token expired") {
        super(401, message);
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
    headers?: Record<string, string>;
    throwErrors?: boolean;
    setLoading?: (state: boolean) => void;
}

type AccountResponse = DbUser & { token: ApiTokenResponse };

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

        const response = await this.post<ApiTokenResponse>("/auth/login", form, { throwErrors: true });

        if (response.data?.access_token) {
            localStorage.setItem(API_TOKEN, response.data?.access_token);
            window.postMessage(API_TOKEN);
        }
        return response;
    }

    async me(options?: ApiOptions): Promise<User> {
        const response = await this.get<AccountResponse>("/users/me", options);

        // refresh global token
        if (response.data?.token?.access_token) {
            localStorage.setItem(API_TOKEN, response.data?.token?.access_token);
            window.postMessage(API_TOKEN);
        }

        return User.fromDbUser(response.data);
    }

    async updateProfile(user: User, options?: ApiOptions): Promise<User> {
        const response = await this.patch<AccountResponse>(
            "/users/me",
            JSON.stringify({
                first_name: user.firstName,
                last_name: user.lastName,
            }),
            options
        );

        return response.data && User.fromDbUser(response.data);
    }

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

    //
    // Basic API interaction functionality
    //
    async exec<T = unknown>({
        url,
        method,
        body,
        options = {},
    }: {
        url: string;
        method: string;
        body?: BodyInit;
        options: ApiOptions;
    }): Promise<JsonResponse<T>> {
        let result: JsonResponse<T> = {} as JsonResponse<T>;
        options?.setLoading?.(true);
        try {
            const response = await fetch(
                config.apiBasePath + url,
                this.prepareRequest({ method, body, headers: options.headers })
            );
            result = response as JsonResponse<T>;
        } catch (e) {
            if (options.throwErrors) {
                throw e;
            }

            const ex = e as Error;
            sendNotification(formatError(ex));
            return result;
        } finally {
            options?.setLoading?.(false);
        }

        if (result?.headers?.get("content-type")?.includes("json")) {
            result.data = (await result.json()) as T;
        }

        let ex: Error | undefined;
        if ([401, 403].includes(result.status)) {
            localStorage.removeItem(API_TOKEN);
            window.postMessage(API_TOKEN);
            ex = AuthenticationError.fromStatus(result.status);
        } else if (result.status > 499) {
            ex = new ServerError(result.status, result.statusText);
        } else if (result.status > 399) {
            ex = new RequestError(result.status, result.statusText);
        }

        if (ex) {
            if (options.throwErrors) {
                throw ex;
            } else {
                sendNotification(formatError(ex));
            }
        }

        return result;
    }

    async get<T = unknown>(url: string, options: ApiOptions = {}): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "get", options });
    }

    async delete<T = unknown>(url: string, options: ApiOptions = {}): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "delete", options });
    }

    async post<T = unknown>(url: string, body: BodyInit, options: ApiOptions = {}): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "post", body, options });
    }

    async patch<T = unknown>(url: string, body: BodyInit, options: ApiOptions = {}): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "patch", body, options });
    }

    async put<T = unknown>(url: string, body: BodyInit, options: ApiOptions = {}): Promise<JsonResponse<T>> {
        return this.exec<T>({ url, method: "put", body, options });
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
            method: method.toUpperCase(),
            headers,
            body,
            credentials: "include" as RequestCredentials,
            mode: "cors" as RequestMode,
        };

        if (authToken) {
            const decodedToken = jwtDecode<JwtPayload>(authToken);
            if (isTokenNotExpired(decodedToken)) {
                request.headers["Authorization"] = `bearer ${authToken}`;
            } else {
                throw new AuthTokenExpiredError("Login session has expired");
            }
        }

        return request;
    }
}
