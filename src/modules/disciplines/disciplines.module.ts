import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formation, FormationSchema } from '../../schemas/formation.schema';
import { Discipline, DisciplineSchema } from '../../schemas/discipline.schema';
import { LearningModule, ModuleSchema } from '../../schemas/module.schema';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './disciplines.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Discipline.name, schema: DisciplineSchema },
			{ name: Formation.name, schema: FormationSchema },
			{ name: LearningModule.name, schema: ModuleSchema },
		]),
	],
	controllers: [DisciplinesController],
	providers: [DisciplinesService],
	exports: [DisciplinesService],
})
export class DisciplinesModule {}
