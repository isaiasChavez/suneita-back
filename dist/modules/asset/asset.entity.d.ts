import { Admin } from "../user/user/admin.entity";
export declare class Asset {
    id: string;
    url: string;
    uuid: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    createUuid(): void;
    admin: Admin;
}
