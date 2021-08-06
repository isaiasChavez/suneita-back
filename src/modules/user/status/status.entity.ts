import { Suscription } from 'src/modules/suscription/suscription.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Admin } from '../user/admin.entity';
import { User } from '../user/user.entity';
// import { Target } from '../../trivia/target/target.entity';

@Entity({ schema: 'Users' })
export class Status {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @OneToMany(type => User, user => user.status)
    user: User[];

    @OneToMany(type => Admin, admin => admin.status)
    admin: Admin[];

    // @OneToMany(type => Target, target => target.role)
    // target: Target[];

}