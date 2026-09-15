import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { MailModule } from './notification/mail.module';
import { AuthGuard } from '../../guards/auth.guard';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.register({}), // secrets fournis explicitement à chaque sign/verify (voir AuthService)
		MailModule,
	],
	controllers: [AuthController],
	// AuthGuard est fourni ici car il est utilisé (@UseGuards(AuthGuard)) sur /auth/logout.
	// Tout autre module qui protège une route avec AuthGuard doit aussi le lister dans ses providers
	// (ou importer JwtModule + ConfigModule là où c'est nécessaire) — voir note plus bas.
	providers: [AuthService, AuthGuard],
	exports: [AuthService],
})
export class AuthModule {}