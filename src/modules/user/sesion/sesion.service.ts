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
import * as moment from 'moment';
import { ADMIN, Types, Roles, USER_NORMAL } from '../../../types';
import { Type } from '../type/type.entity';
import { User } from '../user/user.entity';
import { Admin } from '../user/admin.entity';
import { SuperAdmin } from '../user/superadmin.entity';
import { Token } from '../token/token.entity';
import { Invitation } from '../invitation/invitation.entity';
import { Role } from '../role/role.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import { Asset } from 'src/modules/asset/asset.entity';
const jwt = require('jsonwebtoken');
@Injectable()
export class SesionService {
  constructor (
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
    console.log({ jwt });
    this.jwtService = jwt;
  }
  types: Types;
  roles: Roles;
  jwtService;
  token: string;

  async RequesLogin(requestDTO: ReuestSesionDTO): Promise<any> {
    try {
      console.log('Entra');
      let response = null;
      let user: Admin | SuperAdmin | User;
      let type: Type;

      user = await this.superAdminRepository.findOne({
        relations: ['type', 'admins'],
        where: { email: requestDTO.email, isActive: true },
      });

      if (!user) {
        user = await this.adminRepository.findOne({
          relations: ['type', 'users'],
          where: { email: requestDTO.email, isActive: true },
        });
      }
      if (!user) {
        user = await this.userRepository.findOne({
          relations: ['type'],
          where: { email: requestDTO.email, isActive: true },
        });
      }
      if (!user) {
        return {
          status: 1,
          msg: `email does't exist`,
        };
      } else {
        console.log({ user });
        type = user.type;
      }

      const match = await bcrypt.compare(requestDTO.password, user.password);

      if (match) {
        let sesionExist: Sesion;

        if (type.name === this.types.SUPERADMIN) {
          sesionExist = await this.sesionRepository.findOne({
            where: { superadmin: user },
          });
        }
        if (type.name === this.types.ADMIN) {
          sesionExist = await this.sesionRepository.findOne({
            where: { admin: user },
          });
        }
        if (type.name === this.types.USER) {
          sesionExist = await this.sesionRepository.findOne({
            where: { user },
          });
        }
        console.log({ sesionExist });
        if (sesionExist) {
          console.log('Existe una sesion');
          await this.sesionRepository.remove(sesionExist);
        }

        let sesion: Sesion;
        if (type.name === this.types.ADMIN) {
          sesion = this.sesionRepository.create({
            admin: user,
          });
        }
        if (type.name === this.types.SUPERADMIN) {
          sesion = this.sesionRepository.create({
            superadmin: user,
          });
        }
        if (type.name === this.types.USER) {
          sesion = this.sesionRepository.create({
            user,
          });
        }

        let dataChildrens: { admins: Admin[], users: User[] } = {
          admins:[],users:[],
        };

        if (type.name === this.types.SUPERADMIN) {
          dataChildrens.admins = await this.adminRepository.find({
            select: ['name', 'lastname', 'avatar', 'uuid', 'isActive','email'],
            relations: ['suscriptions'],
            where: {
              superadmin: user,
            },
          });
          dataChildrens.users = await this.userRepository.find({
            select: ['name', 'lastname', 'avatar', 'uuid', 'isActive'],
            relations: ['suscriptions'],
            where: {
              superadmin: user,
            },
          });

        }
        if (type.name === this.types.ADMIN) {
          dataChildrens.users = await this.userRepository.find({
            select: ['name', 'lastname','email', 'avatar', 'uuid', 'isActive'],
            relations: ['suscriptions'],
            where: {
              admin: user,
            },
          });

          
        }
        const childrens = {
          admins: [], users: []
        } 

        const filterUsers = (child) => {
          const dataToSend = {
            avatar: child.avatar,
            email: child.email,
            isActive: child.isActive,
            lastname: child.lastname,
            uuid:child.uuid,
            name: child.name,
            suscriptions: null,
            lastSuscription:null
          }
          dataToSend.suscriptions = child.suscriptions.map((suscription: Suscription) => {
            return {
              cost: suscription.cost,
              createdAt: suscription.createdAt,
              finishedAt: suscription.finishedAt,
              isActive: suscription.isActive,
              isDeleted: suscription.isDeleted,
              startedAt: suscription.startedAt,
            }
          })
          dataToSend.lastSuscription = dataToSend.suscriptions[0] ? dataToSend.suscriptions[0]:null 
          return dataToSend
        }


        if (type.name === this.types.SUPERADMIN) {
          childrens.admins = dataChildrens.admins.map((child) => {
            const dataToSend = {
              avatar: child.avatar,
              email: child.email,
              isActive: child.isActive,
              uuid:child.uuid,
              lastname: child.lastname,
              name: child.name,
              suscriptions: null,
              lastSuscription:null
            }
            dataToSend.suscriptions = child.suscriptions.map((suscription: Suscription) => {
              return {
                cost: suscription.cost,
                invitations: suscription.invitations,
                createdAt: suscription.createdAt,
                finishedAt: suscription.finishedAt,
                isActive: suscription.isActive,
                isDeleted: suscription.isDeleted,
                startedAt: suscription.startedAt,
              }
            })
            dataToSend.lastSuscription = dataToSend.suscriptions[0]
            return dataToSend
          })
          childrens.users  = dataChildrens.users.map(filterUsers)


        } else {
          childrens.users = dataChildrens.users.map(filterUsers)
          
        }


        const loggedUser = await this.sesionRepository.save(sesion);
        console.log({ loggedUser });
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
            email: user.email,
            childrens,
            type: type.id,
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
      console.log({requestDTO})
      let response = null;
      let user: Admin | SuperAdmin | User;
      let type: Type;

      // user = await this.superAdminRepository.findOne({
      //   relations: ['type', 'admins'],
      //   where: { email: requestDTO.email, isActive: true },
      // });

        user = await this.adminRepository.findOne({
          relations: ['type', 'users'],
          where: { email: requestDTO.email, isActive: true },
        });
      if (!user) {
        user = await this.userRepository.findOne({
          relations: ['type'],
          where: { email: requestDTO.email, isActive: true },
        });
      }
      // if (!user) {
      //   return {
      //     status: 1,
      //     msg: `email does't exist`,
      //   };
      // } else {
      //   type = user.type;
      // }

      // const match = await bcrypt.compare(requestDTO.password, user.password);

      // if (match) {
      //   let sesionExist: Sesion;

      //   if (type.name === this.types.SUPERADMIN) {
      //     sesionExist = await this.sesionRepository.findOne({
      //       where: { superadmin: user },
      //     });
      //   }
      //   if (type.name === this.types.ADMIN) {
      //     sesionExist = await this.sesionRepository.findOne({
      //       where: { admin: user },
      //     });
      //   }
      //   if (type.name === this.types.USER) {
      //     sesionExist = await this.sesionRepository.findOne({
      //       where: { user },
      //     });
      //   }
      //   if (sesionExist) {
      //     await this.sesionRepository.remove(sesionExist);
      //   }

      //   let sesion: Sesion;
      //   let assets: Asset[];

      //   if (type.name === this.types.ADMIN) {
      //     assets = await this.assetRepository.find({
      //       where: { admin: user },
      //     })
      //     sesion = this.sesionRepository.create({
      //       admin: user,
      //     });
      //   }
      //   if (type.name === this.types.SUPERADMIN) {

      //     sesion = this.sesionRepository.create({
      //       superadmin: user,
      //     });
      //   }
      //   if (type.name === this.types.USER) {
      //      assets = await this.assetRepository.find({
      //       where: { user: user },
      //     })
      //     console.log('Creando');
      //     sesion = this.sesionRepository.create({
      //       user,
      //     });
      //   }
      //   const loggedUser = await this.sesionRepository.save(sesion);
        const payload = {
          usuario: {
            uuid: user.uuid,
            type: user.type.id,
          },
        };

        const token = await this.jwtService.sign(payload, process.env.SECRETA, {
          expiresIn: 36000000,
        });

        //TYPE IMG 1
        //TYPE IMG 360 2
        //TYPE video 3
        //TYPE video 360 4
      
        response = {
          profile: {
            token,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            avatar: user.avatar,
            
            type: user.type.id,
          },
          status: 0,
        };
        return response;
    // }
    //    else {
    //     response = { status: 2, msg: "pass doesn't match" };
    //   }
      // return response;
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
      let response = null;

      const user = await this.userRepository.findOne({
        where: { email: reuestSesionLogOutDTO.email },
      });

      if (user) {
        const actualSesion = await this.sesionRepository.findOne({
          where: { user: user },
        });

        await this.sesionRepository.remove(actualSesion);

        response = { status: 0 };
      } else {
        response = { status: 1 };
      }

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
      console.log({ email })
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
  async passwordRecovery(requestDTO: PasswordRecovery): Promise<any> {
    try {
      let response = { status: 0 };
      const jwtDecoded = jwt.verify(requestDTO.token, process.env.TOKEN_SECRET);
      if (!jwtDecoded.token) {
        response = { status: 10 };
      } else {
        const tokenExist = await this.tokenRepository.findOne(
          jwtDecoded.token,
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
          console.log({ userToUpdate });
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
          response = { status: 10 };
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
      console.log('***', { requestEmail }, '***');

      let response = { status: 0 };

      const user: User = await this.userRepository.findOne({
        relations: ['type'],
        where: { email: requestEmail },
      });

      const admin: Admin = await this.adminRepository.findOne({
        relations: ['type'],
        where: { email: requestEmail },
      });

      if (user || admin) {
        const pettioner: User | Admin = user ? user : admin;
        if (user && admin) {
          return {
            status: 5,
            msg: 'No es posible',
          };
        }

        //Verificar si ya existe un token antes que este

        const existToken = await this.tokenRepository.findOne({
          relations: ['admin', 'user'],
          where: {
            user: user ? user : null,
            admin: admin ? admin : null,
          },
        });
        if (existToken) {
          console.log({ existToken });
          await this.tokenRepository.remove(existToken);
        }

        const newToken = this.tokenRepository.create({
          email: requestEmail,
          type: pettioner.type,
          user: user ? user : null,
          admin: admin ? admin : null,
          superAdmin: null,
        });

        const registerToken = await this.tokenRepository.save(newToken);
        const token = await jwt.sign(
          { token: registerToken.id },
          process.env.TOKEN_SECRET,
          {
            expiresIn: 7200,
          },
        );

        // Se envia correo
        // await this.mailerService.sendMail({
        //     to: requestEmail,
        //     subject: "Recuperacion de contraseña.",
        //     template: "./recovery.hbs",
        //     context: {
        //         url: jwtToken,
        //         email: requestEmail,
        //     },
        // });
        return {
          token,
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

  async create(createUserDTO: CreateUserDTO): Promise<any> {
    try {
      console.log("Creando nuevo usuario")
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

      console.log({ user })





      
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
