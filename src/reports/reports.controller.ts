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
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('/reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    console.log('🚀 ~ ReportsController ~ getEstimate ~ query:', query);
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() reportDto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(reportDto, user);
  }

  @Patch('/approve/:id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id') id: string,
    @Body() body: ApproveReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.changeApproval(id, body, user);
  }
}
