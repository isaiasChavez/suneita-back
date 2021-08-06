import { Admin } from '../user/admin.entity';
import { User } from '../user/user.entity';
export declare class Status {
    id: number;
    name: string;
    user: User[];
    admin: Admin[];
}
