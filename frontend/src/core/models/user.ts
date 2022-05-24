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
    permissions: string[] = [];

    constructor(email: string) {
        this.email = email;
    }

    static fromJwt(jwt: JwtUser): User {
        return {
            email: jwt.sub,
            id: jwt.uid,
            firstName: jwt.fn,
            lastName: jwt.ln,
            permissions: (jwt.permissions || "").split(PERMISSIONS_SEPARATOR),
        };
    }
}
