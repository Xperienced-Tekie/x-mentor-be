import { Module } from '@nestjs/common';
import { CodeDemonController } from './codeDemon.controller';
import { UsersModule } from 'src/users/users.module'; 
import { CDChatModule } from './schema/cdChat.module';
import { CodeDemonService } from './CodeDemon.service';

@Module({
  imports: [UsersModule, CDChatModule], 
  controllers: [CodeDemonController],
  providers: [CodeDemonService],
})
export class CodeDemonModule {}
