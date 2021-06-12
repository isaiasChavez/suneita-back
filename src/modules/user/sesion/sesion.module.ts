import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SesionController } from "./sesion.controller";
import { SesionService } from "./sesion.service";
import { Sesion } from "./sesion.entity";
import { User } from "../user/user.entity";
import { Admin } from "../user/admin.entity";
import { SuperAdmin } from "../user/superadmin.entity";
import { Type } from "../type/type.entity";
import { Token } from "../token/token.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Sesion]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Admin]),
    TypeOrmModule.forFeature([SuperAdmin]),
    TypeOrmModule.forFeature([Type]),
    TypeOrmModule.forFeature([Token]),

  ],
  controllers: [SesionController],
  providers: [SesionService],
})
export class SesionModule { }
