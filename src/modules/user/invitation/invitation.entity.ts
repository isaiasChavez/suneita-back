import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Type } from '../type/type.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { User } from '../user/user.entity';

@Entity({ schema: 'Users' })
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 250, nullable: true })
  company: string;

  @Column({ length: 250, nullable: true })
  name: string;

  @Column({ length: 250 })
  email: string;

  @Column({ nullable: true, default: 0 })
  invitations: number;

  @Column({ nullable: true, default: 0 })
  cost: number;

  @Column({
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  startedAt: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  finishedAt: Date;

  @ManyToOne((type) => Type, (tyype) => tyype.token)
  type: Type;

  @ManyToOne((admin) => Admin, (admin) => admin.token)
  admin: Admin;

  @ManyToOne((superAdmin) => SuperAdmin, (superAdmin) => superAdmin.token)
  superAdmin: SuperAdmin;
}
