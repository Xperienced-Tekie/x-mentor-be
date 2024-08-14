import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    return req.user;
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req, @Res() res) {
    try {
      const jwt = await this.authService.login(req.user);

      res.cookie('authToken', jwt.access_token, {
        httpOnly: true,
        secure: true, // Set to true for HTTPS
        sameSite: 'None', // Allow cross-site cookie
        domain: 'vercel.app', // Set the domain to your frontend domain
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.redirect(`https://x-mentor-fe.vercel.app`);
    } catch (err) {
      console.error('GitHub Auth Error:', err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
