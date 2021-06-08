import { Admin } from "../user/admin.entity";
export declare class Sesion {
    id: string;
    loggedInAt: Date;
    playerId: string;
    admin: Admin;
    superadmin: Admin;
}
