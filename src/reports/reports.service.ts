import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async findOne(id: number) {
    const report = await this.repo.findOneBy({ id });
    return report;
  }

  async changeApproval(id: string, body: ApproveReportDto) {
    const { approved } = body;
    const report = await this.findOne(parseInt(id));
    if (!report) throw new NotFoundException('report not found');
    return this.repo.save({ ...report, approved });
  }

  create(reportDto: CreateReportDTO, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }
}
