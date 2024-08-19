import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { MessageSchema } from './message.schema';

export type CDChatDocument = CDChat & Document;

@Schema()
export class CDChat {
  @Prop({ required: true, ref: "User"})
  user: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: "Message" })
  messages: [mongoose.Types.ObjectId];

  @Prop()
  chatTitle: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

}

export const CDChatSchema = SchemaFactory.createForClass(CDChat);
