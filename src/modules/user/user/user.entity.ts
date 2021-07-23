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
  PrimaryColumn,
} from 'typeorm';
import { Type } from '../type/type.entity';
import { Role } from '../role/role.entity';
import { Sesion } from '../sesion/sesion.entity';
import { v4 as uuid } from 'uuid';
import { Admin } from './admin.entity';
import { Token } from '../token/token.entity';
import { SuperAdmin } from './superadmin.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import { Asset } from 'src/modules/asset/asset.entity';

@Entity({ schema: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;


  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({
    type: 'text',
    default:
      'https://d1a370nemizbjq.cloudfront.net/569e30b7-51ee-461a-861a-8a43a72473c1.glb',
  })
  avatar: string;

  @Column({ length: 250 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @ManyToOne((type) => Type, (tyype) => tyype.user)
  type: Type;

  @ManyToOne((type) => Role, (role) => role.user)
  role: Role;

  @ManyToOne(() => Admin, (admin) => admin.users)
  admin: Admin;

  @ManyToOne((type) => SuperAdmin, superadmin => superadmin.users)
  superadmin: SuperAdmin;

  @Column({ type: 'uuid', nullable: true })
  uuid: string;

  @Column({ nullable: false, default: false })
  isDeleted: boolean;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @OneToMany((type) => Token, (token) => token.user)
  token: Token[];

  @OneToMany((type) => Sesion, (sesion) => sesion.user)
  sesion: Sesion[];

    @OneToMany(() => Suscription, suscription => suscription.user)
    suscriptions: Suscription[];

  @OneToMany(() => Asset, asset => asset.user)
  assets: Asset[];
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  createUuid() {
    this.uuid = uuid();
  }
}
