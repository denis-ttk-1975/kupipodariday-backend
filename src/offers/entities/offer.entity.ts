import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import {
  Contains,
  IsInt,
  Length,
  IsUrl,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

//import { Offer } from './../../offers/entities/offer.entity';
import { Wish } from './../../wishes/entities/wish.entity';
import { Wishlist } from './../../wishlists/entities/wishlist.entity';
import { User } from './../../users/entities/user.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.id)
  item: Wish;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
}
