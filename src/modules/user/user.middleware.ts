import { Injectable, NestMiddleware } from '@nestjs/common';
import { ADMIN, SUPER_ADMIN,USER_NORMAL } from 'src/types';
import { SesionTokenDTO } from './sesion/sesion.dto';
const jwt = require('jsonwebtoken');

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No hay token, permiso no valido' });
    }
    try {
      const cifrado: SesionTokenDTO = jwt.verify(token, process.env.SECRETA);
      req.body.adminUuid = null;
      req.body.superAdminUuid = null;
      req.body.userUuid = null;
      if (cifrado.usuario.type === ADMIN) {
        req.body.adminUuid = cifrado.usuario.uuid;
      }
      if (cifrado.usuario.type === SUPER_ADMIN) {
        req.body.superAdminUuid = cifrado.usuario.uuid;
      }
      if (cifrado.usuario.type === USER_NORMAL) {
        req.body.userUuid = cifrado.usuario.uuid;
      }
      req.body.type = cifrado.usuario.type;
      next();
    } catch (error) {
      res.status(401).json({ msg: 'token no valido' });
    }
  }
}
