import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { Admin } from "../user/user/admin.entity";
import { User } from "../user/user/user.entity";
import { TypeAsset } from "./type-asset/type-asset.entity";

@Entity({ schema: "Assets" })
export class Asset {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 300, nullable: false })
    url: string;

    @Column({ length: 300, nullable: true, default:'' })
    thumbnail: string;

    @Column({ type: "uuid", nullable: false })
    uuid: string;

    @Column({ nullable: false, default: true })
    isActive: boolean;

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    createUuid() {
        this.uuid = uuid();
    }

    @ManyToOne(() => Admin, admin => admin.assets)
    admin: Admin;

    @ManyToOne(() => User, user => user.assets)
    user: User;

    @ManyToOne((typeAsset) => TypeAsset, (typeAsset) => typeAsset.asset)
    typeAsset: TypeAsset;

}
