import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';

import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

import { Wishlist } from './entities/wishlist.entity';
import { JwtGuard } from './../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const wishlist = await this.wishlistsService.findOne(+id);
    const userId = req.user.id;
    const wishlistOwner = wishlist[0].owner.id;
    if (userId != wishlistOwner) {
      throw new HttpException(
        {
          status: 403,
          error: 'запрошенный лист желаний принадлежит другому пользователю',
        },
        403,
      );
    }
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    const wishlist = await this.wishlistsService.findOne(+id);
    const userId = req.user.id;
    const wishlistOwner = wishlist[0].owner.id;
    if (userId != wishlistOwner) {
      throw new HttpException(
        {
          status: 403,
          error: 'запрошенный лист желаний принадлежит другому пользователю',
        },
        403,
      );
    }
    return this.wishlistsService.update(+id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const wishlist = await this.wishlistsService.findOne(+id);
    console.log('wishlist: ', wishlist);
    const userId = req.user.id;
    // const wishlistOwner = wishlist[0].owner.id;
    // console.log('wishlistOwner: ', wishlistOwner);

    // if (userId != wishlistOwner) {
    //   throw new HttpException(
    //     {
    //       status: 403,
    //       error: 'запрошенный лист желаний принадлежит другому пользователю',
    //     },
    //     403,
    //   );
    // }
    console.log(1444);
    return this.wishlistsService.remove(+id, req.user);
  }
}
