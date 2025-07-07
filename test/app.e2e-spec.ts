import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Teste API (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let usuarioId: number;
  let usuarioId2: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve registrar um usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/registro')
      .send({ username: 'usuario1', password: 'senha123' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBeDefined();
  });

  it('deve registrar outro usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/registro')
      .send({ username: 'usuario2', password: 'senha123' });
    expect(res.status).toBe(201);
  });

  it('deve logar e obter token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'usuario1', password: 'senha123' });
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    token = res.body.access_token;
  });

  it('deve buscar o id do usuario1', async () => {
    const res = await request(app.getHttpServer())
      .get('/contas/saldo/26');
    expect(res.status).toBe(200);
    usuarioId = 26;
  });

  it('deve buscar o id do usuario2', async () => {
    const res = await request(app.getHttpServer())
      .get('/contas/saldo/27');
    expect(res.status).toBe(200);
    usuarioId2 = 2;
  });

  it('deve depositar na conta do usuario1', async () => {
    const res = await request(app.getHttpServer())
      .post('/contas/deposito')
      .send({ usuarioId, valor: 100 });
    expect(res.status).toBe(201);
    expect(res.body.saldo).toBe('100.00');
  });

  it('deve consultar saldo do usuario1', async () => {
    const res = await request(app.getHttpServer())
      .get(`/contas/saldo/${usuarioId}`);
    expect(res.status).toBe(200);
    expect(res.body.saldo).toBe('100,00');
  });

  it('deve transferir do usuario1 para usuario2', async () => {
    const res = await request(app.getHttpServer())
      .post('/contas/transferencia')
      .send({ origem: usuarioId, destino: usuarioId2, valor: 50 });
    expect(res.status).toBe(201);
    expect(res.body.origem.saldo).toBe('50.00');
    expect(res.body.destino.saldo).toBe('50,00');
  });

  it('deve consultar saldo do usuario1 após transferência', async () => {
    const res = await request(app.getHttpServer())
      .get(`/contas/saldo/${usuarioId}`);
    expect(res.status).toBe(200);
    expect(res.body.saldo).toBe('50,00');
  });

  it('deve consultar saldo do usuario2 após transferência', async () => {
    const res = await request(app.getHttpServer())
      .get(`/contas/saldo/${usuarioId2}`);
    expect(res.status).toBe(200);
    expect(res.body.saldo).toBe('50,00');
  });
});
