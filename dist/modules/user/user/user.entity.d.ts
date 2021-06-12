import { Type } from "../type/type.entity";
import { Role } from "../role/role.entity";
import { Admin } from "./admin.entity";
import { Token } from "../token/token.entity";
export declare class User {
    id: string;
    name: string;
    lastname: string;
    avatar: string;
    email: string;
    password: string;
    type: Type;
    role: Role;
    admin: Admin;
    uuid: string;
    isDeleted: boolean;
    isActive: boolean;
    token: Token[];
    createdAt: Date;
    updatedAt: Date;
    createUuid(): void;
}
