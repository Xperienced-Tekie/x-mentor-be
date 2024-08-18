import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

    res.redirect(https://x-mentor-fe.vercel.app/signin?authToken=${jwt.access_token});
  } catch (err) {
    console.error('GitHub Auth Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
}
