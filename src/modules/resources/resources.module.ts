import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from '../../schemas/lesson.schema';
import { Resource, ResourceSchema } from '../../schemas/resource.schema';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Resource.name, schema: ResourceSchema },
			{ name: Lesson.name, schema: LessonSchema },
		]),
	],
	controllers: [ResourcesController],
	providers: [ResourcesService],
	exports: [ResourcesService],
})
export class ResourcesModule {}
