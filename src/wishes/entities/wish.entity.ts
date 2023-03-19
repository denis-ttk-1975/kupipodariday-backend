import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  Contains,
  IsInt,
  Length,
  IsUrl,
  IsNumber,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

import { Offer } from './../../offers/entities/offer.entity';
//import { Wish } from './../../wishes/entities/wish.entity';
import { Wishlist } from './../../wishlists/entities/wishlist.entity';
import { User } from './../../users/entities/user.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 250,
  })
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  link: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: true,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ type: 'integer', nullable: true })
  @IsInt()
  copied: number;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;
}
