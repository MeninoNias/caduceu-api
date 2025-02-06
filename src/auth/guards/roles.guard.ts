import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass(),]
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    if (!user?.role) throw new ForbiddenException('Acesso negado: perfil não identificado');

    const hasPermission = requiredRoles.some((role) => user.role === role);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Acesso negado: requer perfil ${requiredRoles.join(' ou ')}`,
      );
    }

    return true;
  }
}