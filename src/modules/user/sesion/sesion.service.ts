import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sesion } from './sesion.entity';
import {
  ReuestSesionDTO,
  ReuestSesionLogOutDTO,
  PasswordRecovery,
  CreateAdminDTO,
  CreateUserDTO,
} from './sesion.dto';
import * as bcrypt from 'bcrypt';
import { ADMIN, Types, Roles, USER_NORMAL, TypesNumbers } from '../../../types';
import { Type } from '../type/type.entity';
import { User } from '../user/user.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { Token } from '../token/token.entity';
import { Invitation } from '../invitation/invitation.entity';
import { Role } from '../role/role.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import { Asset } from 'src/modules/asset/asset.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { SimpleRequest } from '../user/user.dto';
import { UserService } from '../user/user.service';
const jwt = require('jsonwebtoken');
@Injectable()
export class SesionService {
  constructor (
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    @InjectRepository(Sesion) private sesionRepository: Repository<Sesion>,
    @InjectRepository(Type) private typeRepository: Repository<Type>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Suscription) private suscriptionRepository: Repository<Suscription>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Asset) private assetRepository: Repository<Asset>,
    @InjectRepository(SuperAdmin)
    private superAdminRepository: Repository<SuperAdmin>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>, // @InjectRepository(Configuration) // private configurationRepository: Repository<Configuration>,
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>, // @InjectRepository(Configuration) // private configurationRepository: Repository<Configuration>,
  ) {
    this.types = {
      ADMIN: 'ADMIN',
      SUPERADMIN: 'SUPERADMIN',
      USER: 'USER',
    };
    this.roles = {
      SUPERADMIN: 'SUPERADMIN',
      ADMIN: 'ADMIN',
      USER: 'USER',
    };
    this.typesNumbers = {
      SUPERADMIN: 1,
      ADMIN: 2,
      USER: 3,
    };
    console.log({ jwt });
    this.jwtService = jwt;
  }
  types: Types;
  typesNumbers: TypesNumbers;

  roles: Roles;
  jwtService;
  token: string;

  async RequesLogin(requestDTO: ReuestSesionDTO): Promise<any> {
    try {
      let response = null;
      const {isAdmin,isSuperAdmin,isGuest,user} =  await this.getWhoIsRequesting(requestDTO.email)
      if (!user) {
        return {
          status: 1,
          msg: `email does't exist`,
        };
      } 

      const match = await bcrypt.compare(requestDTO.password, user.password);

      if (match) {
        let sesionExist: Sesion;

        if (isSuperAdmin) {
          sesionExist = await this.sesionRepository.findOne({
            where: { superadmin: user },
          });
        }
        if (isAdmin) {
          sesionExist = await this.sesionRepository.findOne({
            where: { admin: user },
          });
        }
        if (isGuest) {
          sesionExist = await this.sesionRepository.findOne({
            where: { user },
          });
        }
        if (sesionExist) {
          await this.sesionRepository.remove(sesionExist);
        }

        let sesion: Sesion;
        if (isAdmin) {
          sesion = this.sesionRepository.create({
            admin: user,
            isFromCMS:true
          });
        }
        if (isSuperAdmin) {
          sesion = this.sesionRepository.create({
            superadmin: user,
            isFromCMS:true
          });
        }
        if (isGuest) {
          sesion = this.sesionRepository.create({
            user,
            isFromCMS:true
          });
        }

        const loggedUser = await this.sesionRepository.save(sesion);
        const payload = {
          usuario: {
            uuid: user.uuid,
            type: user.type.id,
          },
        };

        const token = await this.jwtService.sign(payload, process.env.SECRETA, {
          expiresIn: 36000000,
        });

        response = {
          profile: {
            id: loggedUser.id,
            token,
            name: user.name,
            lastname: user.lastname,
            thumbnail: user.thumbnail,
            email: user.email,
            type: user.type.id,
          },
          status: 0,
        };
        return response;
      } else {
        response = { status: 2, msg: "pass doesn't match" };
      }
      return response;
    } catch (err) {
      console.log('SesionService - RequesLogin: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error requesting login',
        },
        500,
      );
    }
  }
  async RequesLoginFromApp(requestDTO: ReuestSesionDTO): Promise<any> {
    try {
      const {isAdmin,isSuperAdmin,isGuest,user} =  await this.getWhoIsRequesting(requestDTO.email)
      if (!user) {
        return {
          status: 1,
          msg: `email does't exist`,
        };
      }
      const match = await bcrypt.compare(requestDTO.password, user.password);
      let response
      if (match) {
        let sesionExist: Sesion;
        if (isSuperAdmin) {
          sesionExist = await this.sesionRepository.findOne({
            where: { superadmin: user },
          });
        }
        if (isAdmin) {
          sesionExist = await this.sesionRepository.findOne({
            where: { admin: user },
          });
        }
        if (isGuest) {
          sesionExist = await this.sesionRepository.findOne({
            where: { user },
          });
        }
        if (sesionExist) {
          await this.sesionRepository.remove(sesionExist);
        }

        let sesion: Sesion;

        if (isAdmin) {
          sesion = this.sesionRepository.create({
            admin: user,
            isFromCMS:false
          });
        }
        if (isSuperAdmin) {
          sesion = this.sesionRepository.create({
            superadmin: user,
            isFromCMS:false
          });
        }
        if (isGuest) {
          sesion = this.sesionRepository.create({
            user,
            isFromCMS:false
          });
        }
        await this.sesionRepository.save(sesion);
        const payload = {
          usuario: {
            uuid: user.uuid,
            type: user.type.id,
          },
        };
        const token = await this.jwtService.sign(payload, process.env.SECRETA, {
          expiresIn: 36000000000,
        });    
        response = {
          profile: {
            token,
            name: user.name,
            lastname: user.lastname,
            thumbnail: user.thumbnail,
            email: user.email,
            avatar: user.avatar,
            type: user.type.id,
          },
          status: 0,
        };
        return response;
    }
       else {
        response = { status: 2, msg: "pass doesn't match" };
      }
      return response;
    } catch (err) {
      console.log('SesionService - RequesLogin: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error requesting login',
        },
        500,
      );
    }
  }



  async RequesLogout(
    reuestSesionLogOutDTO: ReuestSesionLogOutDTO,
  ): Promise<any> {
    try {
      const {isFromCMS} = reuestSesionLogOutDTO
      const {isAdmin,isSuperAdmin,isGuest,user} =  await this.userService.getWhoIsRequesting(reuestSesionLogOutDTO)
      let response = null;
      let actualSesion:Sesion
      if (!user) {
          return { status:1, msg: 'user not found'}
      }
      if (isSuperAdmin) {
        actualSesion = await this.sesionRepository.findOne({
          where: {superadmin: user,isFromCMS},
        });
      }
      if (isAdmin) {
        actualSesion = await this.sesionRepository.findOne({
          where: { admin: user,isFromCMS},
        });
      }
      if (isGuest) {
        actualSesion = await this.sesionRepository.findOne({
          where: {  user,isFromCMS },
        });
      }
      if (!actualSesion) {
        return { status:2, msg: 'sesion not found'}
      }
      await this.sesionRepository.remove(actualSesion);
      response = { status: 0 };

      return response;
    } catch (err) {
      console.log('SesionService - RequesLogout: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error requesting logout',
        },
        500,
      );
    }
  }
  async decifreToken(email: string): Promise<any> {
    try {
      const dataInvitation: Invitation =
        await this.invitationRepository.findOne({
          where: { email },
          relations: ['type'],
        });
      if (!dataInvitation) {
        return { status: 1 };
      }

      return {
        data: {
          email: dataInvitation.email,
          company: dataInvitation.company,
          type: dataInvitation.type.id
        },
        status: 0,
      };
    } catch (err) {
      console.log('SesionService - Decifre: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error decifring ',
        },
        500,
      );
    }
  }
  async validateIfExistToken(token: string): Promise<any> {
    try {
      console.log("validateIfExistToken")
      let jwtDecoded:{ tokenid:number}
      try {
        jwtDecoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const tokenExist = await this.tokenRepository.findOne(
          jwtDecoded.tokenid,
        );
        if (tokenExist) {
          return {status:0, msg:"Token valid"}
        }
        return {status:3, msg:"Token does not exist"}
      } catch (error) {
        return {status:1, msg:"Token invalid"}
      }

    } catch (err) {
      console.log('SesionService - validateIfExistToken: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error decifring ',
        },
        500,
      );
    }
  }
  async passwordRecovery(requestDTO: PasswordRecovery): Promise<any> {
    try {
      console.log("passwordRecovery")
      let response = { status: 0,msg:'ok' };
      let jwtDecoded:{ tokenid:number}
      try {
        jwtDecoded = jwt.verify(requestDTO.token, process.env.TOKEN_SECRET);
        
      } catch (error) {
        console.log({error})
        return {status:5, msg:"Token invalid"}
      }

      if (!jwtDecoded.tokenid) {
        response = { status: 10, msg:'token does not exist'};
      } else {
        const tokenExist = await this.tokenRepository.findOne(
          jwtDecoded.tokenid,
          {
            relations: ['type', 'user', 'admin'],
          },
        );
        if (tokenExist) {
          const passwordHashed = await bcrypt.hash(requestDTO.password, 12);
          let userToUpdate: Admin | User = null;
          if (tokenExist.user) {
            userToUpdate = await this.userRepository.findOne(
              tokenExist.user.id,
              {
                where: {
                  isActive: true,
                },
              },
            );
          }
          if (tokenExist.admin) {
            userToUpdate = await this.adminRepository.findOne(
              tokenExist.admin.id,
              {
                where: {
                  isActive: true,
                },
              },
            );
          }
          if (!userToUpdate) {
            return {
              status: 5,
              msg: 'Ah ocurrido un  error',
            };
          }

          userToUpdate.password = passwordHashed;
          // Se actualiza password del usuario
          if (tokenExist.type.id === USER_NORMAL) {
            await this.userRepository.save(userToUpdate);
          }

          if (tokenExist.type.id === ADMIN) {
            await this.adminRepository.save(userToUpdate);
          }
          // Se elimina el token de la base de datos
          await this.tokenRepository.remove(tokenExist);
        } else {
          response = { status: 10, msg:'token does not exist'};
        }
      }

      return response;
    } catch (err) {
      console.log('UserService - passwordRecovery: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error ressetign password',
        },
        500,
      );
    }
  }

  async requestPasswordReset(requestEmail: string): Promise<any> {
    try {
      let response = { status: 0 };
      const {isAdmin,isGuest,user} =  await this.getWhoIsRequesting(requestEmail)
      if (user) {        
        //Verificar si ya existe un token antes que este
        let existToken:Token
          existToken = await this.tokenRepository.findOne({
            relations: ['admin', 'user'],
            where: {
              user: isGuest?user:null,
              admin:isAdmin? user:null
            },
          });
        if (existToken) {
          await this.tokenRepository.remove(existToken);
        }
        const newToken = this.tokenRepository.create({
          email: requestEmail,
          type: user.type,
          user: isGuest ? user : null,
          admin: isAdmin ? user : null,
          superAdmin: null,
        });

        const registerToken = await this.tokenRepository.save(newToken);

        const token = await jwt.sign(
          { tokenid: registerToken.id },
          process.env.TOKEN_SECRET,
          {
            expiresIn: 7200000,
          },
        );
        console.log({registerToken,token})
        // Se envia correo
        // await this.mailerService.sendMail({
        //     to: requestEmail,
        //     subject: "Recuperacion de contraseña.",
        //     template: __dirname + '/recovery.hbs',
        //     context: {
        //         token,
        //     },
        // });
        return {
          status: 0,
        };
      } else {
        response = { status: 1 };
      }
      return response;
    } catch (err) {
      console.log('UserService - requestPasswordReset: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error requesting password reset',
        },
        500,
      );
    }
  }


  async getWhoIsRequesting(email:string): Promise<{isAdmin:boolean,isSuperAdmin:boolean,isGuest:boolean,user:SuperAdmin|Admin|User}> {
    try {
      let user: Admin | SuperAdmin | User;
      user = await this.superAdminRepository.findOne({
        relations: ['type'],
        where: { email, isActive: true },
      });

      if (!user) {
        user = await this.adminRepository.findOne({
          relations: ['type'],
          where: { email, isActive: true },
        });
      }

      if (!user) {
        user = await this.userRepository.findOne({
          relations: ['type'],
          where: { email, isActive: true },
        });
      }
      const isSuperAdmin = user.type.id === this.typesNumbers.SUPERADMIN;
      const isAdmin = user.type.id === this.typesNumbers.ADMIN;
      const isGuest = user.type.id === this.typesNumbers.USER;
      return {isAdmin,isSuperAdmin,isGuest,user}
    } catch (err) {
      console.log('SesionService - getWhoIsRequesting: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error Changing Name  user',
        },
        500,
      );
    }
  }


  async createAdmin(createAdminDTO: CreateAdminDTO): Promise<any> {
    try {
      //Verificar que exista un token con el email asociado

      const invitation: Invitation = await this.invitationRepository.findOne({
        relations: ['superAdmin', 'admin'],
        where: {
          email: createAdminDTO.email,
        },
      });

      if (!invitation) {
        return {
          status: 10,
          error: 'No hay una invitación para este usuario',
        };
      }
      //Verificar que el superadministrador exista
      const existUser = await this.adminRepository.findOne({
        where: {
          email: createAdminDTO.email,
          isDeleted: false,
        },
      });
      if (existUser) {
        await this.invitationRepository.remove(invitation)
        return {
          status: 2,
          error: 'Este email ya existe',
          existUser,
        };
      }
      const adminRole = await this.roleRepository.findOne({
        where: {
          name: this.roles.ADMIN,
        },
      });
      const adminType = await this.roleRepository.findOne({
        where: {
          name: this.types.ADMIN,
        },
      });
      const userPassword = await bcrypt.hash(createAdminDTO.password, 12);

      const admin = this.adminRepository.create({

        superadmin: invitation.superAdmin,
        role: adminRole,
        type: adminType,
        name: createAdminDTO.name,
        lastname: createAdminDTO.lastname,
        email: createAdminDTO.email,
        password: userPassword,
        business: invitation.company,
      });

      await this.adminRepository.save(admin);
      const newAdmin = await this.adminRepository.findOne({
        where: {
          email: admin.email,
        },
      });

      const userSuscription = this.suscriptionRepository.create({
        admin: newAdmin,
        cost: invitation.cost,
        invitations:invitation.invitations,
        startedAt: new Date(invitation.startedAt),
        finishedAt: new Date(invitation.finishedAt),
      });
      await this.suscriptionRepository.save(userSuscription);
      await this.invitationRepository.remove(invitation)

      return { status: 0 };
    } catch (err) {
      console.log('UserService - create: ', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error creting users',
        },
        500,
      );
    }
  }

  async createGuest(createUserDTO: CreateUserDTO): Promise<any> {
    try {
      const invitation: Invitation = await this.invitationRepository.findOne({
        relations: ['admin', 'superAdmin'],
        where: {

          email: createUserDTO.email,
        },
      });
      if (!invitation) {
        return {
          status: 1,
          error: 'No existe una invitación',
        };
      }
      const existUser = await this.userRepository.findOne({
        where: {
          email: createUserDTO.email,
          isDeleted: false,
        },
      });
      if (existUser) {
        return {
          status: 2,
          error: 'Este email ya existe',
        };
      }
      const userRole = await this.roleRepository.findOne({
        where: {
          name: this.roles.USER,
        },
      });
      const userType = await this.roleRepository.findOne({
        where: {
          name: this.types.USER
        },
      });
      const userPassword = await bcrypt.hash(createUserDTO.password, 12);
      const user = this.userRepository.create({
        admin: invitation.admin,
        superadmin: invitation.superAdmin,
        role: userRole,
        type: userType,
        name: createUserDTO.name,
        lastname: createUserDTO.lastname,
        email: createUserDTO.email,
        password: userPassword,
      });
      
      await this.userRepository.save(user);

      if (invitation.superAdmin) {
        const newUser:User = await this.userRepository.findOne({
        where: {
          email: user.email,
        },
      });
      const userSuscription = this.suscriptionRepository.create({
        user: newUser,
        cost: invitation.cost,
        invitations:0,
        startedAt: new Date(invitation.startedAt),
        finishedAt: new Date(invitation.finishedAt),
      });
      await this.suscriptionRepository.save(userSuscription);
      }
      await this.invitationRepository.remove(invitation)
      return { status: 0 };
    } catch (err) {
      console.log('UserService - create: ', err);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error getting users',
        },
        500,
      );
    }
  }



}
