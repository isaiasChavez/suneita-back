import { Admin } from '../user/admin.entity';
import { User } from '../user/user.entity';
export declare class Sesion {
    id: string;
    loggedInAt: Date;
    playerId: string;
    isFromCMS: boolean;
    admin: Admin;
    superadmin: Admin;
    user: User;
}
