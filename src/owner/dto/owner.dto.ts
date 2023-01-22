import { IsNotEmpty } from 'class-validator';

export class OwnerDto {
  @IsNotEmpty()
  name: string;
  products: number[];
}
