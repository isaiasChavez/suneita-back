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
import { Type } from "../type/type.entity";
import { Role } from "../role/role.entity";
import { Sesion } from "../sesion/sesion.entity";
import { v4 as uuid } from "uuid";

@Entity({ schema: "Users" })
export class User {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 50 })
    lastName: string;

    @Column({ type: "text" })
    avatar: string;


    @Column({ length: 250 })
    email: string;

    @Column({ length: 100 })
    password: string;

    @ManyToOne(
        (type) => Type,
        (tyype) => tyype.user
    )
    type: Type;


    @ManyToOne(
        (type) => Role,
        (role) => role.user
    )
    role: Role;

    @OneToMany(
        (type) => Sesion,
        (sesion) => sesion.user
    )
    sesion: Sesion[];


    @Column({ type: "uuid", nullable: true })
    uuid: string;


    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @Column({ nullable: false, default: false })
    isActive: boolean;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;



    @BeforeInsert()
    createUuid() {
        this.uuid = uuid();
    }


}
