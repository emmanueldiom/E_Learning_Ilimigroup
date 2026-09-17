import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formation, FormationSchema } from '../../schemas/formation.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { FormationsController } from './formations.controller';
import { FormationsService } from './formations.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Formation.name, schema: FormationSchema },
			{ name: User.name, schema: UserSchema },
		]),
	],
	controllers: [FormationsController],
	providers: [FormationsService],
	exports: [FormationsService],
})
export class FormationsModule {}
