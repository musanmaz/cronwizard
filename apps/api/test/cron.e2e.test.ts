import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Cron API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('v1', { exclude: ['healthz', 'readyz'] });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('GET /healthz', async () => {
      const res = await request(app.getHttpServer()).get('/healthz').expect(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /readyz', async () => {
      const res = await request(app.getHttpServer()).get('/readyz').expect(200);
      expect(res.body.status).toBe('ready');
    });
  });

  describe('POST /v1/cron/generate', () => {
    it('generates every 5 minutes unix', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/generate')
        .send({ mode: 'minutes', params: { every: 5 }, format: 'unix' })
        .expect(201);

      expect(res.body.cron).toBe('*/5 * * * *');
      expect(res.body.description).toBeTruthy();
      expect(res.body.normalized.unix).toBe('*/5 * * * *');
    });

    it('generates daily at 09:00 quartz', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/generate')
        .send({ mode: 'daily', params: { at: { hour: 9, minute: 0 } }, format: 'quartz' })
        .expect(201);

      expect(res.body.cron).toMatch(/^0 /);
    });

    it('rejects invalid mode', async () => {
      await request(app.getHttpServer())
        .post('/v1/cron/generate')
        .send({ mode: 'invalid', params: {}, format: 'unix' })
        .expect(400);
    });
  });

  describe('POST /v1/cron/next', () => {
    it('returns next runs for Europe/Istanbul', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/next')
        .send({
          cron: '0 9 * * 1-5',
          format: 'unix',
          timezone: 'Europe/Istanbul',
          count: 5,
        })
        .expect(201);

      expect(res.body.nextRuns).toHaveLength(5);
      expect(res.body.human).toHaveLength(5);
    });

    it('rejects invalid cron', async () => {
      await request(app.getHttpServer())
        .post('/v1/cron/next')
        .send({ cron: 'bad', format: 'unix', timezone: 'UTC', count: 3 })
        .expect(400);
    });
  });

  describe('POST /v1/cron/validate', () => {
    it('validates correct cron', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/validate')
        .send({ cron: '*/5 * * * *', format: 'unix' })
        .expect(201);

      expect(res.body.valid).toBe(true);
    });

    it('reports invalid cron', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/validate')
        .send({ cron: 'nope', format: 'unix' })
        .expect(201);

      expect(res.body.valid).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /v1/cron/export', () => {
    it('exports k8s CronJob YAML', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/export')
        .send({
          cron: '0 9 * * 1-5',
          format: 'unix',
          target: 'k8s',
          options: { name: 'test-job' },
        })
        .expect(201);

      expect(res.body.text).toContain('CronJob');
      expect(res.body.text).toContain('test-job');
    });

    it('exports GitHub Actions YAML', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/export')
        .send({ cron: '0 0 * * *', format: 'unix', target: 'gha' })
        .expect(201);

      expect(res.body.text).toContain('schedule');
    });

    it('exports systemd timer', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/cron/export')
        .send({ cron: '0 3 * * 0', format: 'unix', target: 'systemd' })
        .expect(201);

      expect(res.body.text).toContain('[Timer]');
    });
  });
});
