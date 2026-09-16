import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { MailModule } from './notification/mail.module';
import { GuardsModule } from '../../guards/guards.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.register({}), // secrets fournis explicitement à chaque sign/verify (voir AuthService)
		MailModule,
		GuardsModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}