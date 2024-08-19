import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { CDChatService } from "./schema/cdChat.service";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class CodeDemonService {
    constructor(
        private readonly usersService: UsersService,
        private readonly cdChatService: CDChatService,
    ) {}

    async getSavedChat(userId: string) {
        const user = await this.usersService.findOneByGithubId(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.plan === "freemium") {
            return null;
        }

        const chats = await this.cdChatService.findChatsByUserId(user._id.toString(), user.plan === "premium" ? 5 : undefined);
        return chats.map(chat => chat.chatTitle);
    }

    private async getChatHistory(chatId: string, prompt: string) {
        const chat: any = await this.cdChatService.findChatsById(chatId, (query) =>
            query.populate({
                path: 'messages',
                select: 'message userType',
            })
        );

        let history = [];

        if (chat && chat.messages.length > 0) {
            history.push({
                role: "user",
                parts: [
                    {
                        text: `Answer user prompt based on your personality. 
                Always make reference to the User Bio Data and User Meta Data while responding 
                in a personalized manner that suits their goals and lifestyle.
                Answer should be in markdown format that could be converted to a very good looking HTML.
                \nUser Prompt: \`${chat.messages[0].message}\``,
                    },
                ],
            });

            chat.messages.forEach((msg: any) => {
                history.push({
                    role: msg.userType === "user" ? "user" : "model",
                    parts: [{ text: msg.message }],
                });
            });
        } else {
            history.push({
                role: "user",
                parts: [
                    {
                        text: `Answer user prompt based on your personality. 
                Always make reference to the User Bio Data and User Meta Data while 
                responding in a personalized manner that suits their goals and lifestyle. 
                Answer should be in markdown format that could be converted to a very good looking HTML.
                \nUser Prompt:  \`${prompt}\``,
                    },
                ],
            });
        }

        history.push({
            role: "user",
            parts: [{ text: prompt }],
        });

        return history;
    }

    private async generateChatTitle(prompt: string): Promise<string> {
        try {
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error("Gemini API key is missing.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

            const generationConfig = {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 60,
                responseMimeType: "text/plain",
            };

            const chatSession = model.startChat({
                generationConfig,
                history: [
                    {
                        role: "system",
                        parts: [
                            { text: "Generate a concise and catchy title for the following conversation prompt:" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            });

            const result = await chatSession.sendMessage(prompt);

            if (!result || !result.response) {
                throw new Error("Model failed to provide a response.");
            }

            return result.response.text().trim();
        } catch (error: any) {
            console.error("Error generating chat title with Gemini:", error);
            throw new Error("Error generating chat title: " + error.message);
        }
    }

    async promptCodeDemon(prompt: string, userId: string, chatId?: string) {
        try {
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error("Gemini API key is missing.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

            const generationConfig = {
                temperature: 1,
                topP: 0.95,
                maxOutputTokens: 2048,
                responseMimeType: "text/plain",
            };

            let chatHistory;
            let newChatId;

            if (!chatId) {
                const chatTitle = await this.generateChatTitle(prompt);
                const newChat = await this.cdChatService.createChat({
                    user: userId,
                    message: prompt,
                    userType: 'user',
                    chatTitle: chatTitle,
                });
                newChatId = newChat._id.toString();
                chatHistory = await this.getChatHistory(newChatId, prompt);
            } else {
                const updatedChat = await this.cdChatService.updateChat(chatId, {
                    message: prompt,
                    user: userId,
                    userType: 'user',
                });
                newChatId = updatedChat._id.toString();
                chatHistory = await this.getChatHistory(newChatId, prompt);
            }

            const chatSession = model.startChat({
                generationConfig,
                history: chatHistory,
            });

            const result = await chatSession.sendMessage(prompt);

            if (!result || !result.response) {
                throw new Error("Model failed to provide a response.");
            }

            const codeDemonReply = result.response.text();

            await this.cdChatService.updateChat(newChatId, {
                message: codeDemonReply,
                user: userId,
                userType: 'ai',
            });

            return {
                text: codeDemonReply,
                userType: 'ai',
            };
        } catch (error: any) {
            console.error("Error in prompting Code Demon:", error);
            throw new Error("Error in prompting Code Demon: " + error.message);
        }
    }
}
