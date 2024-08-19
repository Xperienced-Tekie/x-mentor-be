import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CDChat, CDChatSchema } from './cdChat.schema';
import { Message, MessageSchema } from './message.schema';
import { CDChatService } from './cdChat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: CDChat.name, schema: CDChatSchema }, 
        {name: Message.name, schema: MessageSchema}
    ]),
  ],
  providers: [CDChatService],
  exports: [CDChatService],
})
export class CDChatModule {}
