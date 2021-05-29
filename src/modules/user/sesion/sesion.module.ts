import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SesionController } from "./sesion.controller";
import { SesionService } from "./sesion.service";
import { Sesion } from "./sesion.entity";
// import { User } from "../user/user.model";

@Module({
  imports: [
    TypeOrmModule.forFeature([Sesion]),
    // TypeOrmModule.forFeature([User]),
  ],
  controllers: [SesionController],
  providers: [SesionService],
})
export class SesionModule { }
