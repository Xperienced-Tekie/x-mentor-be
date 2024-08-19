import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CDChat, CDChatDocument } from './cdChat.schema';
import { MessageDocument } from './message.schema';

@Injectable()
export class CDChatService {
    constructor(
        @InjectModel(CDChat.name) private cdChatModel: Model<CDChatDocument>,
        @InjectModel('Message') private messageModel: Model<MessageDocument>,
    ) { }

    async createChat(chatData: {
        user: string;
        message: string;
        userType: string;
        chatTitle: string;
    }) {

        const newMessage = new this.messageModel({
            message: chatData.message,
            user: chatData.user,
            userType: chatData.userType,
        });
        const savedMessage = await newMessage.save();

        const newChat = new this.cdChatModel({
            user: chatData.user,
            messages: [savedMessage._id],
            chatTitle: chatData.chatTitle,
        });
        return newChat.save();
    }

    async updateChat(
        chatId: string,
        messageData: { message: string; user: string, userType: string },
        chatTitle?: string,
    ) {

        const newMessage = new this.messageModel({
            message: messageData.message,
            user: messageData.user,
            userType: messageData.userType,
        });
        const savedMessage = await newMessage.save();

        const updateFields: any = {
            $push: { messages: savedMessage._id },
        };

        if (chatTitle) {
            updateFields.$set = { chatTitle: chatTitle };
        }

        // Update the chat document
        const chat = await this.cdChatModel.findByIdAndUpdate(
            chatId,
            updateFields,
            { new: true }
        );

        if (!chat) {
            throw new Error('Chat not found');
        }

        return chat;
    }

    async findChatsByUserId(userId: string, limit?: number): Promise<CDChat[]> {
        const query = this.cdChatModel.find({ user: userId }).sort({ createdAt: -1 });

        if (limit) {
            query.limit(limit);
        }

        return query.exec();
    }

    async findChatsById(chatId: string, callback?: (query: any) => any) {
        let query = this.cdChatModel.findById(chatId);
    
        if (callback) {
            query = callback(query);
        }
    
        return query.exec();
    }    

}
