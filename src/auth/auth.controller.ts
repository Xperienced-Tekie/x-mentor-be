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

    // Send the JWT to the parent window using a script
    const script = `
      <script>
        // Send the JWT to the parent window
        window.opener.postMessage({ token: '${jwt.access_token}' }, 'https://congenial-potato-x5rgx975jvgp296vp-3000.app.github.dev');
        // Close the popup window
        window.close();
      </script>
    `;

    // Respond with the script
    res.send(script);
  } catch (err) {
    console.error('GitHub Auth Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
}
