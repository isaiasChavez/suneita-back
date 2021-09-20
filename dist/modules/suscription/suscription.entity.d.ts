import { Admin } from "../user/user/admin.entity";
import { User } from "../user/user/user.entity";
export declare class Suscription {
    id: string;
    admin: Admin;
    user: User;
    startedAt: Date;
    finishedAt: Date;
    cost: number;
    uuid: string;
    invitations: number;
    isDeleted: boolean;
    isActive: boolean;
    isWaiting: boolean;
    createdAt: Date;
    updatedAt: Date;
    createUuid(): void;
}
