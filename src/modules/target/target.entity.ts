import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
} from "typeorm";
// import { Type } from "../../users/type/type.entity";
// import { Role } from "../../users/role/role.entity";

@Entity({ schema: "Assets" })
export class Target {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(
    //     (type) => Type,
    //     (tyype) => tyype.target
    // )
    // type: Type;

    // @ManyToOne(
    //     (type) => Role,
    //     (role) => role.target
    // )
    // role: Role;


}
