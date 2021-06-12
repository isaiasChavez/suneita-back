import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Type } from '../type/type.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { User } from '../user/user.entity';

@Entity({ schema: 'Users' })
export class Token {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 250 })
    email: string;

    @ManyToOne(type => Type, tyype => tyype.token)
    type: Type;

    @ManyToOne(admin => Admin, admin => admin.token)
    admin: Admin;

    @ManyToOne(superAdmin => SuperAdmin, superAdmin => superAdmin.token)
    superAdmin: SuperAdmin;

    @ManyToOne(user => User, user => user.token)
    user: User;
}