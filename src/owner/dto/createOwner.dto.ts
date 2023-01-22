import { IsNotEmpty } from 'class-validator';

export class CreateOwnerDto {
  @IsNotEmpty()
  name: string;
}
