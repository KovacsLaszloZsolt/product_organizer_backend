import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsNumber()
  ownerId: number;

  @IsOptional()
  @IsString()
  pictures: string[];

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  picturesRoute: string;
}

// id Int @id @default(autoincrement())
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
//   name String
//   description String?
//   category Category @relation(fields: [categoryId], references: [id])
//   categoryId Int
//   owner ProductOwner @relation(fields: [ownerId], references: [id])
//   ownerId Int
//   pictures String[]
//   price Int
//   size Int
//   picturesRoute String
// Név
// Leírás
// Méret
// Almbumhely
// Fotó
// Felhasználónév
// Ár
