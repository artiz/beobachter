import * as gravatar from "gravatar";
import { JwtPayload } from "jwt-decode";

export class JwtUser implements JwtPayload {
    sub?: string; // user.email,
    uid?: string; // id,
    fn?: string; // first_name,
    ln?: string; // last_name,
    permissions?: string;
}

export class DbUser {
    id!: string;
    email!: string;
    first_name!: string;
    last_name!: string;
    is_active!: boolean;
    is_superuser!: boolean;
}

export const PERMISSIONS_SEPARATOR = ",";

export class User {
    id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    permissions?: string[] = [];

    constructor(email: string) {
        this.email = email;
    }

    static fromJwt(jwt: JwtUser): User {
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

    static fromDbUser(user: DbUser): User {
        const avatar = user.email ? gravatar.url(user.email, { s: "128" }) : undefined;

        return {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            avatarUrl: avatar,
        };
    }
}
