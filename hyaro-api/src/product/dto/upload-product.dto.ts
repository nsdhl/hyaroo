import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import mongoose from 'mongoose';
export class UploadProductDto {
  name: string;
  description: string;
  variants: string;
  stock: boolean;
  basePrice: number;
  categories: mongoose.Schema.Types.ObjectId[];
}

export class UpdateProductDto extends UploadProductDto {
  imagesToDelete: string[];
  videosToDelete: string[];
  promotionalImagesToDelete: string[];
}

export class ChangeProductFeaturedOrder {
  @IsBoolean()
  isFeatured: boolean;

  @ValidateIf((o) => o.isFeatured === true)
  @IsNotEmpty({ message: 'Featured order is required if product is featured' })
  @IsNumber({}, { message: 'Featured order must be a number' })
  @Min(1, { message: 'Featured order must be greater than or equal to 1' })
  @Max(12, { message: 'Featured order must be less than or equal to 12' })
  featuredOrder: number;
}

export type ratingOrder = 'lowerThan' | 'higherThan';
