import { Type } from '../type/type.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { User } from '../user/user.entity';
export declare class Token {
    id: string;
    email: string;
    type: Type;
    admin: Admin;
    superAdmin: SuperAdmin;
    user: User;
}
