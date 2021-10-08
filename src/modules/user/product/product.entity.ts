import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ schema: 'Users' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 250, nullable: true })
  name: string;

  @Column({ nullable: true, default: 0 })
  cost: number;

  @ManyToOne((user) => User, (user) => user.token)
  user: User;
  
}
