import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";

@Entity({ schema: "Users" })
export class Sesion {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "timestamp without time zone",
        default: () => "CURRENT_TIMESTAMP",
    })
    loggedInAt: Date;

    @Column({ length: 200, nullable: true })
    playerId: string;

    @ManyToOne(
        (type) => User,
        (user) => user.sesion
    )
    user: User;
}
