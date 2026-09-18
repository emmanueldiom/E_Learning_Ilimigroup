import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from '../../schemas/lesson.schema';
import { LearningModule, ModuleSchema } from '../../schemas/module.schema';
import { Resource, ResourceSchema } from '../../schemas/resource.schema';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Lesson.name, schema: LessonSchema },
			{ name: LearningModule.name, schema: ModuleSchema },
			{ name: Resource.name, schema: ResourceSchema },
		]),
	],
	controllers: [LessonsController],
	providers: [LessonsService],
	exports: [LessonsService],
})
export class LessonsModule {}
