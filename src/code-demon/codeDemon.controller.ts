import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CodeDemonService } from './CodeDemon.service';

@Controller('code-demon')
export class CodeDemonController {
  constructor(private readonly codeDemonService: CodeDemonService) {}

  @UseGuards(JwtAuthGuard)
  @Get('saved-chats')
  async getSavedChats(@Req() req) {
    console.log(req);
    const userId = req.user.userId;
    console.log("userId", userId)
    const savedChats = await this.codeDemonService.getSavedChat(userId);
    return { savedChats };
  }

  @UseGuards(JwtAuthGuard)
  @Post('prompt-codedemon')
  async promptCodeDemon(
    @Body('prompt') prompt: string,
    @Req() req,
    @Query('chatId') chatId?: string
  ) {
    console.log(req);
    const userId = req.user.userId;
    const response = await this.codeDemonService.promptCodeDemon(prompt, userId, chatId);
    return { response };
  }
}
