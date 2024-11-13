import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from 'src/commons/decorators/isPublic.decorator';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { RolesGuard } from 'src/commons/guards/roles.guard';
import { IRequest, ISessionUser } from 'src/interfaces/interfaces';
import { Role } from 'src/user/schema/user.schema';
import { DeleteProductDto } from './dto/delete-product.dto';
import {
  ChangeProductFeaturedOrder,
  UpdateProductDto,
  UploadProductDto,
  ratingOrder,
} from './dto/upload-product.dto';
import { ProductService } from './product.service';

const storage = diskStorage({
  destination: __dirname + './../../media/product',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
  },
});

@UseGuards(AuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images' }, { name: 'videos' }, { name: 'promotionalImages' }],
      { storage },
    ),
  )
  upload(
    @Body() uploadProductDto: UploadProductDto,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      promotionalImages: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    @Request() req: IRequest,
  ) {
    const user = req.user as ISessionUser;
    return this.productService.upload(files, uploadProductDto, user.userId);
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Patch(':productId')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images' }, { name: 'videos' }, { name: 'promotionalImages' }],
      { storage },
    ),
  )
  updateProduct(
    @Param('productId') productId: mongoose.Schema.Types.ObjectId,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      promotionalImages: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
  ) {
    return this.productService.updateProduct(
      files,
      updateProductDto,
      productId,
    );
  }

  @Roles(Role.ADMIN)
  @Put('featured/:productId')
  @UsePipes(new ValidationPipe())
  changeProductFeaturedOrder(
    @Param('productId') productId: string,
    @Body() body: ChangeProductFeaturedOrder,
  ) {
    return this.productService.updateFeaturedProduct(productId, body);
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Patch()
  deleteProduct(@Body() deleteProductDto: DeleteProductDto) {
    return this.productService.deleteProduct(deleteProductDto.productId);
  }

  @Roles(Role.ADMIN, Role.VENDOR, Role.SUPPLIER)
  @Get('admin')
  getAdminProduct(@Request() req: IRequest) {
    const { userId } = req.user;
    return this.productService.getAdminProducts(userId);
  }

  @Public()
  @Get()
  getProducts(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('categories') categories: mongoose.Schema.Types.ObjectId[],
    @Query('user') user: mongoose.Schema.Types.ObjectId,
    @Query('role') role: mongoose.Schema.Types.ObjectId[],
    @Query('searchKeyword') searchKeyword: string,
    @Query('priceLow') priceLow: string,
    @Query('priceHigh') priceHigh: string,
    @Query('ratingFlow') ratingFlow: ratingOrder,
    @Query('rating') rating: number,
  ) {
    return this.productService.getProducts(
      limit,
      page,
      categories,
      user,
      role,
      searchKeyword,
      priceLow,
      priceHigh,
      ratingFlow,
      rating,
    );
  }
  @Public()
  @Get('featured')
  getFeaturedProduct() {
    return this.productService.getFeaturedProducts();
  }
  @Public()
  @Get(':productId')
  getProductById(
    @Param('productId') productId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.productService.getProductById(productId);
  }
}
