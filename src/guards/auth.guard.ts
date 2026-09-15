import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractToken(request);

		if (!token) {
			throw new UnauthorizedException('Token manquant');
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			});
			request.user = payload; // { sub: userId, email, role }
		} catch {
			throw new UnauthorizedException('Token invalide ou expiré');
		}

		return true;
	}

	private extractToken(request: any): string | undefined {
		const authHeader = request.headers['authorization'];
		if (!authHeader) return undefined;
		const [type, token] = authHeader.split(' ');
		return type === 'Bearer' ? token : undefined;
	}
}