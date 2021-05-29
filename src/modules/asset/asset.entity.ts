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

@Entity({ schema: "Assets" })
export class Asset {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 50, nullable: false })
    url: string;

    // @ManyToOne(
    //     (type) => Type,
    //     (tyype) => tyype.user
    // )
    // type: Type;

    @Column({ type: "uuid", nullable: false })
    uuid: string;

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
