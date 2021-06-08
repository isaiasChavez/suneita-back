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

@Entity({ schema: "Users" })
export class Suscription {

    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => Admin, admin => admin.suscriptions)
    admin: Admin;

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




    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @Column({ nullable: false, default: true })
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
