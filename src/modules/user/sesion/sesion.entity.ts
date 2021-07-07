import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { User } from '../user/user.entity';

@Entity({ schema: 'Users' })
export class Sesion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  loggedInAt: Date;

  @Column({ length: 200, nullable: true })
  playerId: string;

  // @ManyToOne(
  //     (type) => User,
  //     (user) => user.sesion
  // )
  // user: User;
  @ManyToOne((type) => Admin, (admin) => admin.sesion)
  admin: Admin;
  @ManyToOne((type) => SuperAdmin, (superadmin) => superadmin.sesion)
  superadmin: Admin;
  @ManyToOne((type) => User, (user) => user.sesion)
  user: User;
}
