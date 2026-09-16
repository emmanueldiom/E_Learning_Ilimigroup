import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { normaliserRole, Role } from '../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles?.length) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const role = normaliserRole(request.user?.role);
		const hasAccess = role !== undefined && requiredRoles.some((requiredRole) =>
			this.roleHasAccess(role, requiredRole),
		);

		if (!hasAccess) {
			throw new ForbiddenException('Permissions insuffisantes');
		}

		return true;
	}

	private roleHasAccess(userRole: Role, requiredRole: Role): boolean {
		return userRole === requiredRole ||
			(userRole === Role.SUPER_ADMINISTRATEUR && requiredRole === Role.ADMINISTRATEUR);
	}
}