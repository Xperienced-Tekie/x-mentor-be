import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(githubId: string): Promise<any> {
    const user = await this.usersService.findOneByGithubId(githubId);
    if (user) {
      return user;
    }
    return null;
  }

  async createUser(githubId: string, username: string, accessToken: string) {
    return await this.usersService.create({
      githubId,
      username,
      accessToken,
    });
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId, githubId: user.githubId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
