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
import { Status } from "../user/status/status.entity";
import { Admin } from "../user/user/admin.entity";
import { User } from "../user/user/user.entity";

@Entity({ schema: "Users" })
export class Suscription {

    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => Admin, admin => admin.suscriptions)
    admin: Admin;

    @ManyToOne(() => User, user => user.suscriptions)
    user: User;

    @Column({
        type: "timestamp without time zone",
        nullable: false,
        default: () => "CURRENT_TIMESTAMP",
    })
    startedAt: Date;

    @Column({
        type: "timestamp without time zone",
        nullable: false,
        default: () => "CURRENT_TIMESTAMP",
    })
    finishedAt: Date;

    @Column({ type: "numeric", precision: 4, nullable: false, default: 0 })
    cost: number;


    @Column({ type: "uuid", nullable: false })
    uuid: string;

    @Column({ nullable: true, default: 0 })
    invitations: number;

   

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @Column({ nullable: false, default: true })
    isActive: boolean;

    @Column({ nullable: false, default: false })
    isWaiting: boolean;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    createUuid() {
        this.uuid = uuid();
    }
}
