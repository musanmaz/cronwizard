import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('healthz')
  @ApiOperation({ summary: 'Liveness probe' })
  healthz() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('readyz')
  @ApiOperation({ summary: 'Readiness probe' })
  readyz() {
    return { status: 'ready', timestamp: new Date().toISOString() };
  }
}
