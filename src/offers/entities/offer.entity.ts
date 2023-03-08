import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column()
  user: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  item: string;

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
