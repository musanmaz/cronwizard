import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CronService } from './cron.service';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import {
  generateRequestSchema,
  nextRunsRequestSchema,
  validateRequestSchema,
  exportRequestSchema,
} from '@cronwizard/shared';
import { GenerateDto, NextRunsDto, ValidateDto, ExportDto } from './cron.dto';

@ApiTags('Cron')
@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a cron expression from wizard parameters' })
  @ApiResponse({ status: 200, description: 'Cron expression generated' })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  @UsePipes(new ZodValidationPipe(generateRequestSchema))
  generate(@Body() body: GenerateDto) {
    return this.cronService.generate(body);
  }

  @Post('next')
  @ApiOperation({ summary: 'Calculate next run times for a cron expression' })
  @ApiResponse({ status: 200, description: 'Next run times calculated' })
  @ApiResponse({ status: 400, description: 'Invalid cron expression' })
  @UsePipes(new ZodValidationPipe(nextRunsRequestSchema))
  nextRuns(@Body() body: NextRunsDto) {
    return this.cronService.nextRuns(body);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a cron expression' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  @UsePipes(new ZodValidationPipe(validateRequestSchema))
  validate(@Body() body: ValidateDto) {
    return this.cronService.validate(body);
  }

  @Post('export')
  @ApiOperation({ summary: 'Export cron as k8s/gha/systemd config' })
  @ApiResponse({ status: 200, description: 'Export text generated' })
  @ApiResponse({ status: 400, description: 'Invalid cron expression' })
  @UsePipes(new ZodValidationPipe(exportRequestSchema))
  export(@Body() body: ExportDto) {
    return this.cronService.export(body);
  }
}
