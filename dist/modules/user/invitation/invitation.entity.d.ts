import { Type } from '../type/type.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
export declare class Invitation {
    id: string;
    company: string;
    name: string;
    email: string;
    invitations: number;
    cost: number;
    startedAt: Date;
    finishedAt: Date;
    type: Type;
    admin: Admin;
    superAdmin: SuperAdmin;
}
