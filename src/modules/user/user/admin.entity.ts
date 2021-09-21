import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from "typeorm";
import { Type } from "../type/type.entity";
import { Role } from "../role/role.entity";
import { Sesion } from "../sesion/sesion.entity";
import { v4 as uuid } from "uuid";
import { SuperAdmin } from "./superadmin.entity";
import { User } from "./user.entity";
import { Suscription } from "src/modules/suscription/suscription.entity";
import { Asset } from "src/modules/asset/asset.entity";
import { Token } from "../token/token.entity";
import { Status } from "../status/status.entity";

@Entity({ schema: "Users" })
export class Admin {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 50 })
    lastname: string;

    @Column({ type: "text", default: "https://d1a370nemizbjq.cloudfront.net/569e30b7-51ee-461a-861a-8a43a72473c1.glb" })
    avatar: string;
    @Column({
        type: 'text',
        default:
          'https://renderapi.s3.amazonaws.com/LOZsbkJ26.png',
      })
      thumbnail: string;
 @Column({
    type: 'text',
    default:
      'https://ocupath.fra1.digitaloceanspaces.com/app/defaultapp.png',
  })
  roomImage: string;
    @Column({ length: 250 })
    email: string;
    

    @Column({ length: 100 })
    password: string;

    @Column({ length: 100, nullable: true })
    business: string;

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
    @ManyToOne((type) => Status, (status) => status.admin)
    status: Status;

    @ManyToOne((type) => SuperAdmin, superadmin => superadmin.admins)
    superadmin: SuperAdmin;


    @OneToMany(() => User, user => user.admin)
    users: User[];


    @OneToMany(
        (type) => Token,
        (token) => token.admin
    )
    token: Token[];



    @OneToMany(
        (type) => Sesion,
        (sesion) => sesion.admin
    )
    sesion: Sesion[];

    @OneToMany(() => Suscription, suscription => suscription.admin)
    suscriptions: Suscription[];


    @OneToMany(() => Asset, asset => asset.admin)
    assets: Asset[];


    @Column({ type: "uuid", nullable: true })
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
        this.email = this.email.toLocaleLowerCase().trim()
    }


}
