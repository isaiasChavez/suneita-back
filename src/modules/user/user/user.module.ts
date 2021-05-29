import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { Token } from "../token/token.entity";
import { Type } from "../type/type.entity";
import { Role } from "../role/role.entity";
import { Sesion } from "../sesion/sesion.entity";
// import { Target } from "../../trivia/target/target.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // TypeOrmModule.forFeature([Target]),
    TypeOrmModule.forFeature([Token]),
    TypeOrmModule.forFeature([Type]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Sesion]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule { }
