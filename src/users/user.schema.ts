import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  githubId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({enum: ["freemium", "premium", "unlimited", "human mentor"]})
  plan: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
