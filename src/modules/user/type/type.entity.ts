import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Token } from "../token/token.entity";
import { User } from "../user/user.entity";
// import { Target } from "../../trivia/target/target.entity";

@Entity({ schema: "Users" })
export class Type {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @OneToMany(
        (type) => Token,
        (token) => token.type
    )
    token: Token[];

    @OneToMany(
        (type) => User,
        (user) => user.type
    )
    user: User[];

    //   @OneToMany(
    //     (type) => Target,
    //     (target) => target.type
    //   )
    //   target: Target[];


}
