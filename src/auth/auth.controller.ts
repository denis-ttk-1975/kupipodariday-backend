import { Controller, Post, Req, Body, UseGuards } from '@nestjs/common';

import { CreateUserDto } from './../users/dto/create-user.dto';
import { UsersService } from './../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.signin(user);
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req): Promise<{ access_token: string }> {
    return this.authService.signin(req.user);
  }
}
