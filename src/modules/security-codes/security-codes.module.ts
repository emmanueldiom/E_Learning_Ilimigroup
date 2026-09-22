import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formation, FormationSchema } from '../../schemas/formation.schema';
import { SecurityCode, SecurityCodeSchema } from '../../schemas/security-code.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import {
	SecurityCodeRequest,
	SecurityCodeRequestSchema,
} from '../../schemas/security-code-request.schema';
import { SecurityCodesController } from './security-codes.controller';
import { SecurityCodesService } from './security-codes.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: SecurityCode.name, schema: SecurityCodeSchema },
			{ name: Formation.name, schema: FormationSchema },
			{ name: User.name, schema: UserSchema },
			{ name: SecurityCodeRequest.name, schema: SecurityCodeRequestSchema },
		]),
	],
	controllers: [SecurityCodesController],
	providers: [SecurityCodesService],
	exports: [SecurityCodesService],
})
export class SecurityCodesModule {}