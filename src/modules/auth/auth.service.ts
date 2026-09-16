import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from '../../dto/auth/login.dto';
import { RegisterDto } from '../../dto/auth/register.dto';
import { ResetPasswordDto } from '../../dto/auth/reset-password.dto';
import { User, UserDocument } from '../../schemas/user.schema';
import { MailService } from './notification/mail.service';
import { Role } from '../../common/enums/role.enum';

const EMAIL_VERIFICATION_EXPIRES_MINUTES = 24 * 60; // 24h — cohérent avec le cahier des charges
const PASSWORD_RESET_EXPIRES_MINUTES = 60; // 1h

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
	) {}

	// ---------------------------------------------------------------------
	// INSCRIPTION
	// ---------------------------------------------------------------------
	async register(registerDto: RegisterDto) {
		const existingUser = await this.userModel.findOne({
			email: registerDto.email,
		});

		if (existingUser) {
			throw new ConflictException('Cet email est déjà utilisé');
		}

		const hashedPassword = await bcrypt.hash(registerDto.password, 12);

		// Génère le token de vérification — on ne stocke jamais le token en clair,
		// uniquement son hash SHA-256 (comparaison faite dans verifyEmail()).
		const { token, tokenHash, expires } = this.generateExpiringToken(
			EMAIL_VERIFICATION_EXPIRES_MINUTES,
		);

		const user = await this.userModel.create({
			...registerDto,
			role: Role.ETUDIANT,
			password: hashedPassword,
			isEmailVerified: false,
			emailVerificationTokenHash: tokenHash,
			emailVerificationExpires: expires,
		});

		await this.mailService.sendVerificationEmail(user.email, user.nom, token);

		// Pas de connexion automatique : le compte n'est pas encore vérifié.
		return {
			message:
				'Compte créé. Vérifiez votre boîte mail pour activer votre compte (lien valable 24h).',
			user: this.toPublicUser(user),
		};
	}

	// ---------------------------------------------------------------------
	// VÉRIFICATION EMAIL (lien magique)
	// ---------------------------------------------------------------------
	async verifyEmail(token: string) {
		const tokenHash = this.hashToken(token);

		const user = await this.userModel
			.findOne({
				emailVerificationTokenHash: tokenHash,
				emailVerificationExpires: { $gt: new Date() },
			})
			.select('+emailVerificationTokenHash +emailVerificationExpires')
			.exec();

		if (!user) {
			throw new BadRequestException('Lien de vérification invalide ou expiré');
		}

		user.isEmailVerified = true;
		user.emailVerificationTokenHash = undefined;
		user.emailVerificationExpires = undefined;
		await user.save();

		return {
			message: 'Adresse email vérifiée. Vous pouvez maintenant vous connecter.',
		};
	}

	// ---------------------------------------------------------------------
	// CONNEXION
	// ---------------------------------------------------------------------
	async login(loginDto: LoginDto) {
		const user = await this.userModel
			.findOne({ email: loginDto.email })
			.select('+password')
			.exec();

		if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
			throw new UnauthorizedException('Email ou mot de passe incorrect');
		}

		if (!user.isActive) {
			throw new UnauthorizedException('Ce compte est désactivé');
		}

		if (!user.isEmailVerified) {
			throw new UnauthorizedException(
				'Veuillez vérifier votre adresse email avant de vous connecter',
			);
		}

		const tokens = await this.generateAuthTokens(user);
		return { ...tokens, user: this.toPublicUser(user) };
	}

	// ---------------------------------------------------------------------
	// MOT DE PASSE OUBLIÉ
	// ---------------------------------------------------------------------
	async forgotPassword(email: string) {
		const user = await this.userModel.findOne({ email });

		// Message générique dans tous les cas — évite l'énumération de comptes
		// existants (cahier des charges, section Sécurité §10).
		const genericResponse = {
			message:
				"Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.",
		};

		if (!user) {
			return genericResponse;
		}

		const { token, tokenHash, expires } = this.generateExpiringToken(
			PASSWORD_RESET_EXPIRES_MINUTES,
		);

		user.passwordResetTokenHash = tokenHash;
		user.passwordResetExpires = expires;
		await user.save();

		await this.mailService.sendPasswordResetEmail(user.email, user.nom, token);

		return genericResponse;
	}

	// ---------------------------------------------------------------------
	// RÉINITIALISATION DU MOT DE PASSE
	// ---------------------------------------------------------------------
	async resetPassword(dto: ResetPasswordDto) {
		const tokenHash = this.hashToken(dto.token);

		const user = await this.userModel
			.findOne({
				passwordResetTokenHash: tokenHash,
				passwordResetExpires: { $gt: new Date() },
			})
			.select('+passwordResetTokenHash +passwordResetExpires')
			.exec();

		if (!user) {
			throw new BadRequestException('Lien de réinitialisation invalide ou expiré');
		}

		user.password = await bcrypt.hash(dto.newPassword, 12);
		user.passwordResetTokenHash = undefined;
		user.passwordResetExpires = undefined;
		// Un changement de mot de passe invalide les sessions existantes.
		user.refreshTokenHash = undefined;
		await user.save();

		return { message: 'Mot de passe réinitialisé avec succès' };
	}

	// ---------------------------------------------------------------------
	// REFRESH TOKEN (rotation)
	// ---------------------------------------------------------------------
	async refreshTokens(refreshToken: string) {
		let payload: { sub: string };
		try {
			payload = await this.jwtService.verifyAsync(refreshToken, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			});
		} catch {
			throw new UnauthorizedException('Refresh token invalide ou expiré');
		}

		const user = await this.userModel
			.findById(payload.sub)
			.select('+refreshTokenHash')
			.exec();

		if (!user || !user.refreshTokenHash) {
			throw new UnauthorizedException('Session invalide, reconnectez-vous');
		}

		const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
		if (!isValid) {
			// Le refresh token présenté ne correspond pas au dernier émis : possible
			// vol de token. On invalide la session par précaution.
			user.refreshTokenHash = undefined;
			await user.save();
			throw new UnauthorizedException('Session invalide, reconnectez-vous');
		}

		return this.generateAuthTokens(user);
	}

	// ---------------------------------------------------------------------
	// DÉCONNEXION
	// ---------------------------------------------------------------------
	async logout(userId: string) {
		await this.userModel.findByIdAndUpdate(userId, {
			$unset: { refreshTokenHash: 1 },
		});
		return { message: 'Déconnecté' };
	}

	// ---------------------------------------------------------------------
	// HELPERS PRIVÉS
	// ---------------------------------------------------------------------
	private async generateAuthTokens(user: UserDocument) {
		const payload = { sub: user._id.toString(), email: user.email, role: user.role };

		const accessToken = await this.jwtService.signAsync(payload as any, {
			secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '20m',
		} as any);

		const refreshToken = await this.jwtService.signAsync(
			{ sub: payload.sub } as any,
			{
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
				expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '30d',
			} as any,
		);

		// On ne stocke que le hash du refresh token, jamais sa valeur en clair.
		user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
		await user.save();

		return { accessToken, refreshToken };
	}

	/** Génère un token aléatoire (renvoyé à l'utilisateur) + son hash SHA-256 (stocké en base). */
	private generateExpiringToken(expiresInMinutes: number) {
		const token = crypto.randomBytes(32).toString('hex');
		const tokenHash = this.hashToken(token);
		const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000);
		return { token, tokenHash, expires };
	}

	private hashToken(token: string): string {
		return crypto.createHash('sha256').update(token).digest('hex');
	}

	private toPublicUser(user: UserDocument) {
		const { password, ...publicUser } = user.toObject();
		return publicUser;
	}
}