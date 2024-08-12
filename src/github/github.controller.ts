import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { GitHubService } from './github.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('github')
export class GitHubController {
  constructor(private readonly githubService: GitHubService) {}

  @Post('create-repo')
  @UseGuards(JwtAuthGuard)
  async createRepo(@Req() req, @Body('repoName') repoName: string) {
    const accessToken = req.user.accessToken;
    return this.githubService.createRepo(accessToken, repoName);
  }

  @Post('add-collaborator')
  @UseGuards(JwtAuthGuard)
  async addCollaborator(
    @Req() req,
    @Body('repoName') repoName: string,
    @Body('username') username: string,
  ) {
    const accessToken = req.user.accessToken;
    return this.githubService.addCollaborator(accessToken, repoName, username);
  }
}
