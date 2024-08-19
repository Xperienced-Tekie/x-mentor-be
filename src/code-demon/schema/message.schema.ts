import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    @Prop({ required: true })
    message: string;

    @Prop({ required: true, ref: "User" })
    user: mongoose.Types.ObjectId;

    @Prop({ required: true, enum: ["ai", "user"] })
    userType: string;

    @Prop({ default: Date.now() })
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message)