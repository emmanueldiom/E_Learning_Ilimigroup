import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formation, FormationSchema } from '../../schemas/formation.schema';
import { Enrollment, EnrollmentSchema } from '../../schemas/enrollment.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { AccessControlService } from './access-control.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Enrollment.name, schema: EnrollmentSchema },
			{ name: Formation.name, schema: FormationSchema },
			{ name: User.name, schema: UserSchema },
		]),
	],
	controllers: [EnrollmentsController],
	providers: [EnrollmentsService, AccessControlService],
	exports: [EnrollmentsService, AccessControlService],
})
export class EnrollmentsModule {}