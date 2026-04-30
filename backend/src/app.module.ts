import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [DatabaseModule, ScoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
