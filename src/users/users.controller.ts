import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from './../wishes/wishes.service';

import { JwtGuard } from './../auth/jwt.guard';

import { User } from './entities/user.entity';
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @Get()
  findEntitiesAllOrByQuery(@Query() query?: any) {
    console.log('query=', query);
    if (!query.hasOwnProperty('email') && !query.hasOwnProperty('username')) {
      console.log('возвратим все!!!');
      return this.usersService.findAll();
    }
    if (query.hasOwnProperty('email')) {
      return this.usersService.findOneByQuery(query.email);
    }
    if (query.hasOwnProperty('username')) {
      return this.usersService.findOneByQuery(query.username);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('me')
  async findMe(@Req() req) {
    const user = await this.usersService.findOne(req.user.id);
    const { password, ...result } = user;

    return result;
  }

  @Patch('me')
  async patchMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(req.user.id, updateUserDto);
    const user = await this.usersService.findOne(req.user.id);
    const { password, ...result } = user;

    return result;
  }

  @Get(':username')
  async findUserByName(@Param('username') username: string) {
    const user = await this.usersService.findOneByName(username);
    const { password, ...result } = user[0];

    return result;
  }

  @Post('find')
  async findUserByNameOrEmail(@Body() body: { query: string }) {
    const user = await this.usersService.findOneByQuery(body.query);
    const { password, ...result } = user[0];

    return result;
  }

  @Get('me/wishes')
  findWishesOfCurrentUser(@Req() req) {
    return this.wishesService.findWishesByUserId(req.user.id);
  }

  @Get(':username/wishes')
  async findWishesByUserName(@Param('username') username: string) {
    const user = await this.usersService.findOneByName(username);
    return await this.wishesService.findWishesByUserId(user[0].id);
  }
}
