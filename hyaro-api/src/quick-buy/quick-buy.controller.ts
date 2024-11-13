import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IRequest } from 'src/interfaces/interfaces';
import { QuickBuyService } from './quick-buy.service';

@UseGuards(AuthGuard)
@Controller('quick-buy')
export class QuickBuyController {
  constructor(private readonly quickBuyService: QuickBuyService) {}

  @Post()
  addQuickBuy(@Request() req: IRequest) {
    const { userId } = req.user;
    return this.quickBuyService.addQuickBuy(userId);
  }

  @Get()
  findQuickBuyUser(@Request() req: IRequest) {
    const { userId } = req.user;
    return this.quickBuyService.findQuickBuyUser(userId);
  }
}
