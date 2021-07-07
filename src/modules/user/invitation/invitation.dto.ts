import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ADMIN, SUPER_ADMIN } from 'src/types';

export class InvitationAdminDTO {
  constructor({ company, email, invitations, cost, startedAt, finishedAt }) {
    this.company = company;
    this.invitations = invitations;
    this.email = email;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.cost = cost;
    this.type = SUPER_ADMIN;
  }
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  company: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNumber()
  invitations: number;
  @IsNumber()
  cost: number;
  @IsDateString()
  @IsString()
  startedAt: string;
  @IsString()
  @IsDateString()
  finishedAt: string;
  
  type: number;
}

export class InvitationUserDTO {
  constructor({ name, email, cost, startedAt, finishedAt }) {
    this.name = name;
    this.email = email;
    this.cost = cost;
    this.startedAt = startedAt;
    this.finishedAt = finishedAt;
    this.type = ADMIN;
  }

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNumber()
  invitations: number;
  @IsNumber()
  cost: number;
  @IsDateString()
  @IsString()
  startedAt: string;
  @IsString()
  @IsDateString()
  finishedAt: string;
  type: number;
}
