// github.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService, 
  ) {
    super({
      clientID: configService.get<string>('githubClientId'),
      clientSecret: configService.get<string>('githubClientSecret'),
      callbackURL: 'https://xmbe.veridaq.com/auth/github/callback',
      scope: ['user', 'repo'],
    });
    console.log({
      clientID: configService.get<string>('githubClientId'),
      clientSecret: configService.get<string>('githubClientSecret'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      const { id, username } = profile;
      let user = await this.authService.validateUser(id);
      if (!user) {
        user = await this.authService.createUser(id, username, accessToken);
      }
      return { userId: user._id, username, accessToken };
    } catch (error) {
      console.error('Error in validate function:', error);
      throw error;
    }
  }
}
