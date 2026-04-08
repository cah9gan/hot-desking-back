import { Body, Controller } from '@nestjs/common';
import { AccessDTO, loginDTO } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login(@Body() data: loginDTO): AccessDTO {
    return this.authService.login(data);
  }
}
