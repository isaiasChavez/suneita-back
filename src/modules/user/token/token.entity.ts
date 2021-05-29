import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Type } from '../type/type.entity';

@Entity({ schema: 'Users' })
export class Token {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 250 })
    email: string;

    @ManyToOne(type => Type, tyype => tyype.token)
    type: Type;

}