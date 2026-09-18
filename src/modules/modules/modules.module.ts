import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Discipline, DisciplineSchema } from '../../schemas/discipline.schema';
import { Lesson, LessonSchema } from '../../schemas/lesson.schema';
import { LearningModule, ModuleSchema } from '../../schemas/module.schema';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: LearningModule.name, schema: ModuleSchema },
			{ name: Discipline.name, schema: DisciplineSchema },
			{ name: Lesson.name, schema: LessonSchema },
		]),
	],
	controllers: [ModulesController],
	providers: [ModulesService],
	exports: [ModulesService],
})
export class ModulesModule {}
