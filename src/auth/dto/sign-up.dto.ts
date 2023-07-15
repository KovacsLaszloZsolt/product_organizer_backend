import { IsNotEmpty, IsString } from 'class-validator';
import { AuthDto } from './auth.dto';

export class SignUpDto extends AuthDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
