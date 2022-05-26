import * as gravatar from "gravatar";

export interface JwtUser {
    sub: string; // user.email,
    uid: string; // id,
    fn: string; // first_name,
    ln: string; // last_name,
    permissions: string;
}

export const PERMISSIONS_SEPARATOR = ",";

export class User {
    id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    permissions: string[] = [];

    constructor(email: string) {
        this.email = email;
    }
    static fromJwt(jwt: JwtUser): User {
        // admin@fastapi-react-project.com
        const avatar = jwt.sub ? gravatar.url(jwt.sub, { s: "128" }) : undefined;

        return {
            email: jwt.sub,
            id: jwt.uid,
            firstName: jwt.fn,
            lastName: jwt.ln,
            permissions: (jwt.permissions || "").split(PERMISSIONS_SEPARATOR),
            avatarUrl: avatar,
        } as User;
    }
}
