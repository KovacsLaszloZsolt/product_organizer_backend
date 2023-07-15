import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto, SignUpDto } from 'src/auth/dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @Post('signin')
  async signin(@Body() dto: AuthDto) {
    return await this.authService.signIn(dto);
  }
}
