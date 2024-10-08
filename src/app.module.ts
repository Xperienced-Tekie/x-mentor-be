import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GitHubModule } from './github/github.module';
import { AppService } from './app.service';
import { CodeDemonModule } from './code-demon/codeDemon.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(process.env.MONGODB_URI), // Connect to MongoDB
    AuthModule,
    UsersModule,
    GitHubModule,
    CodeDemonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
