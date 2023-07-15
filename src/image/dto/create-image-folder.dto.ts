import { IsNotEmpty } from 'class-validator';

export class CreateImageFolderDto {
  @IsNotEmpty()
  name: string;
}
