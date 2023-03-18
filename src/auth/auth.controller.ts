import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  HttpException,
} from '@nestjs/common';

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
  async signup(
    @Body() newUser: CreateUserDto,
    // @Res({ passthrough: true }) response: Response,
  ) {
    const isUsernameExist = await this.usersService.findOneByQuery(
      newUser.username,
    );
    console.log('isUsernameExist: ', isUsernameExist);

    const isEmailExist = await this.usersService.findOneByQuery(newUser.email);
    console.log('isEmailExist: ', isEmailExist);
    if (!!isUsernameExist.length || !!isEmailExist.length) {
      throw new HttpException(
        {
          status: 409,
          error: 'Пользователь с таким email или username уже зарегистрирован',
        },
        409,
      );
    }
    const user = await this.usersService.create(newUser);
    return user;
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req): Promise<{ access_token: string }> {
    return this.authService.signin(req.user);
  }
}
