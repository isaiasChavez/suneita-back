import { Type } from '../type/type.entity';
import { Role } from '../role/role.entity';
import { Sesion } from '../sesion/sesion.entity';
import { Admin } from './admin.entity';
import { Token } from '../token/token.entity';
export declare class SuperAdmin {
    id: string;
    name: string;
    lastname: string;
    avatar: string;
    thumbnail: string;
    email: string;
    roomImage: string;
    password: string;
    type: Type;
    token: Token[];
    role: Role;
    admins: Admin[];
    users: Admin[];
    sesion: Sesion[];
    uuid: string;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createUuid(): void;
}
