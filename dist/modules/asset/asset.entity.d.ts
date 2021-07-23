import { Admin } from "../user/user/admin.entity";
import { User } from "../user/user/user.entity";
import { TypeAsset } from "./type-asset/type-asset.entity";
export declare class Asset {
    id: string;
    url: string;
    thumbnail: string;
    uuid: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    createUuid(): void;
    admin: Admin;
    user: User;
    typeAsset: TypeAsset;
}
