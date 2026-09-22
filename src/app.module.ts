import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { GuardsModule } from './guards/guards.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { FormationsModule } from './modules/formations/formations.module';
import { DisciplinesModule } from './modules/disciplines/disciplines.module';
import { ModulesModule } from './modules/modules/modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { SecurityCodesModule } from './modules/security-codes/security-codes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    FormationsModule,
    DisciplinesModule,
    ModulesModule,
    LessonsModule,
    ResourcesModule,
    EnrollmentsModule,
    SecurityCodesModule,
    GuardsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useExisting: AuthGuard },
    { provide: APP_GUARD, useExisting: RolesGuard },
  ],
})
export class AppModule {}
