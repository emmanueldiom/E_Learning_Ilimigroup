import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private readonly transporter: nodemailer.Transporter;
	private readonly frontendUrl: string;

	constructor(private readonly configService: ConfigService) {
		this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

		this.transporter = nodemailer.createTransport({
			host: this.configService.get<string>('MAIL_HOST'),
			port: this.configService.get<number>('MAIL_PORT'),
			secure: this.configService.get<boolean>('MAIL_SECURE', false),
			auth: {
				user: this.configService.get<string>('MAIL_USER'),
				pass: this.configService.get<string>('MAIL_PASS'),
			},
		});
	}

	async sendVerificationEmail(to: string, firstName: string, token: string): Promise<void> {
		const link = `${this.frontendUrl}/auth/verify-email?token=${token}`;

		await this.send({
			to,
			subject: 'Vérifiez votre adresse email — ILIMIGROUP',
			html: `
				<p>Bonjour ${firstName},</p>
				<p>Merci de votre inscription. Cliquez sur le lien ci-dessous pour vérifier votre adresse email (valable 24 heures, usage unique) :</p>
				<p><a href="${link}">${link}</a></p>
				<p>Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.</p>
			`,
		});
	}

	async sendPasswordResetEmail(to: string, firstName: string, token: string): Promise<void> {
		const link = `${this.frontendUrl}/auth/reset-password?token=${token}`;

		await this.send({
			to,
			subject: 'Réinitialisation de votre mot de passe — ILIMIGROUP',
			html: `
				<p>Bonjour ${firstName},</p>
				<p>Une demande de réinitialisation de mot de passe a été effectuée. Ce lien est valable 1 heure :</p>
				<p><a href="${link}">${link}</a></p>
				<p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email — votre mot de passe restera inchangé.</p>
			`,
		});
	}

	private async send(options: { to: string; subject: string; html: string }): Promise<void> {
		try {
			await this.transporter.sendMail({
				from: this.configService.get<string>('MAIL_FROM', 'no-reply@ilimigroup.com'),
				...options,
			});
		} catch (error) {
			// On ne logue jamais le contenu sensible (token), seulement l'échec d'envoi.
			this.logger.error(`Échec d'envoi d'email à ${options.to}`, error instanceof Error ? error.stack : error);
			throw error;
		}
	}
}