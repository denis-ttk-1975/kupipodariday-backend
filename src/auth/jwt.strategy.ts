import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from './../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      /* Указываем, что токен будет передаваться в заголовке Authorization в формате Bearer <token> */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /* Получаем секрет для подписи JWT токенов из конфигурации */
      secretOrKey: 'some-secret-key',
    });
  }

  /**
   * Метод validate должен вернуть данные пользователя
   * В JWT стратегии в качестве параметра метод получает полезную нагрузку из токена
   */
  async validate(jwtPayload: { sub: number }) {
    // console.log('jwtPayload: ', jwtPayload);
    /* В subject токена будем передавать идентификатор пользователя */

    const user = await this.usersService.findOne(jwtPayload.sub);
    // console.log('user jwt auth: ', user);

    if (!user) {
      console.log('нет авторизации');
      throw new UnauthorizedException();
    }

    return user;
  }
}
