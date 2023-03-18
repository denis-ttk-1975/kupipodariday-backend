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

import { JwtGuard } from '../auth/jwt.guard';

import { User } from './entities/user.entity';
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   console.log('возвратим все!!!');
  //   console.log('возвратим все!!!');
  //   return this.usersService.findAll();
  // }

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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   console.log('id111=', id);
  //   return this.usersService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('me')
  async me(@Req() req) {
    return await this.usersService.findOne(req.user.id);
  }
}
