import { Admin } from "../user/user/admin.entity";
export declare class Suscription {
    id: string;
    admin: Admin;
    startedAt: Date;
    finishedAt: Date;
    cost: number;
    uuid: string;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createUuid(): void;
}
