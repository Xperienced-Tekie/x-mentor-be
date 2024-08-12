import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GitHubService {
  constructor(private readonly httpService: HttpService) {}

  async createRepo(accessToken: string, repoName: string) {
    const url = 'https://api.github.com/user/repos';
    const response = await this.httpService
      .post(
        url,
        { name: repoName },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      .toPromise();
    return response.data;
  }

  async addCollaborator(
    accessToken: string,
    repoName: string,
    username: string,
  ) {
    const url = `https://api.github.com/repos/${username}/${repoName}/collaborators/github-bot`;
    const response = await this.httpService
      .put(url, {}, { headers: { Authorization: `Bearer ${accessToken}` } })
      .toPromise();
    return response.data;
  }
}
