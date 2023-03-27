import { Injectable, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './../users/users.service';
import { User } from './../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByQuery(username);
    // console.log('USER = ', user);
    const matchingPasswordAndHash = await bcrypt.compare(
      pass,
      user[0].password,
    );
    if (!!user[0] && matchingPasswordAndHash) {
      const { password, ...result } = user[0];
      return result;
    }
    throw new HttpException(
      {
        status: 401,
        error: 'Некорректная пара логин и пароль',
      },
      401,
    );
  }

  signin(user: User): { access_token: string } {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'some-secret-key',
        expiresIn: '30d',
      }),
    };
  }
}
