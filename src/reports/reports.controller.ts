import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/user.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { Serialize } from '../interceptor/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() reportDto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(reportDto, user);
  }

  @Patch('/approve/:id')
  @UseGuards(AdminGuard)
  @Serialize(ReportDto)
  approveReport(
    @Param('id') id: string,
    @Body() body: ApproveReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.changeApproval(id, body, user);
  }
}
