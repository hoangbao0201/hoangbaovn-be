import { AuthGuard } from '@nestjs/passport';
import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Request,
    Res,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { RefreshJwtGuard } from './guard/refresh.guard';

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // POST .../auth/register
    @Post('/register')
    register(@Body() body: RegisterDTO) {
        return this.authService.register(body);
    }

    // POST .../auth/login
    @Post('/login')
    login(@Body() body: LoginDTO) {
        return this.authService.login(body);
    }

    // POST .../auth/refresh
    @UseGuards(RefreshJwtGuard)
    @Post('/refresh')
    refreshToken(@Request() req) {
        return this.authService.refreshToken(req.user);
    }

    // GET .../auth/github
    @Get('/github')
    @UseGuards(AuthGuard('github'))
    github(@Request() req) {}

    // GET .../api/auth/github
    @Get('/github/callback')
    @UseGuards(AuthGuard('github'))
    async githubAuthCallback(@Req() req, @Res() res: Response) {
        return this.authService.callbackGithub(req);
    }

    // GET .../api/auth/google
    @Get('/google')
    @UseGuards(AuthGuard('google'))
    google(@Request() req) {}

    // GET .../api/auth/google
    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req) {
        return this.authService.callbackGoogle(req);
    }

    // GET .../api/auth/facebook
    @Get('/facebook')
    @UseGuards(AuthGuard('facebook'))
    facebook(@Request() req) {}

    // GET .../api/auth/facebook
    @Get('/facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthCallback(@Req() req) {
        return this.authService.callbackFacebook(req);
    }

}
