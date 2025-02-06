import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController (e2e)', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/contacts', () => { 

    beforeEach (async () => {
      await testService.deleteAll();
      await testService.createUser();
    })
    
    it ("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: 'salah',
          phone: '',
        })

        logger.info(response.body);

      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined
    })

    it ("should be able to register", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test') 
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '089622209830',
        })

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.first_name).toBe('test')
      expect(response.body.data.last_name).toBe('test')
      expect(response.body.data.email).toBe('test@example.com')
      expect(response.body.data.phone).toBe('089622209830')
    })
   })
  describe('GET /api/contacts/:contactId', () => { 

    beforeEach (async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
    })
    
    it ("should be rejected if contact is not found", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test')

        logger.info(response.body);

      expect(response.status).toBe(404)
      expect(response.body.errors).toBeDefined
    })

    it ("should be able to get contact", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.first_name).toBe('test')
      expect(response.body.data.last_name).toBe('test')
      expect(response.body.data.email).toBe('test@example.com')
      expect(response.body.data.phone).toBe('089622209830')
    })
   })
  describe('PUT /api/contacts/:contactId', () => { 

    beforeEach (async () => {
      await testService.deleteAll();
      
      await testService.createUser();
      await testService.createContact();
    })
    
    it ("should be rejected if request is invalid", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/:${contact.id}`)
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: 'salah',
          phone: '',
        })

        logger.info(response.body);

      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined
    })

    it ("should be rejected if contact not found", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id+1}`)
        .set('Authorization', 'test')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@example.com',
          phone: '089622209830',
        })

        logger.info(response.body);

      expect(response.status).toBe(404)
      expect(response.body.errors).toBeDefined
    })

    it ("should be able to update contact", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test') 
        .send({
          first_name: 'test updated',
          last_name: 'test updated',
          email: 'testupdated@example.com',
          phone: '089622209730',
        })

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.first_name).toBe('test updated')
      expect(response.body.data.last_name).toBe('test updated')
      expect(response.body.data.email).toBe('testupdated@example.com')
      expect(response.body.data.phone).toBe('089622209730')
    })
   })
  describe('DELETE /api/contacts/:contactId', () => { 

    beforeEach (async () => {
      await testService.deleteAll();
      
      await testService.createUser();
      await testService.createContact();
    })

    it ("should be rejected if contact not found", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id+1}`)
        .set('Authorization', 'test')

        logger.info(response.body);

      expect(response.status).toBe(404)
      expect(response.body.errors).toBeDefined
    })

    it ("should be able to delete contact", async () => {
      const contact = await testService.getContact()
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data).toBe(true)
    })
   })

  describe('GET /api/contacts', () => { 

    beforeEach (async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
    })
    

    it ("should be able to get contacts", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(1)
    })

    it ("should be able to get contacts by name", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name:'es'
        })
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(1)
    })


    it ("should be able to get contacts by name but not found", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          name:'memek'
        })
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
    })

    it ("should be able to get contacts by email", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email:'test'
        })
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(1)
    })


    it ("should be able to get contacts by email but not found", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          email:'memek'
        })
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
    })

    it ("should be able to get contacts by phone", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone:'896'
        })
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(1)
    })


    it ("should be able to get contacts by phone but not found", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          phone:'82'
        })
        .set('Authorization', 'test') 

        logger.info(response.body);

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
    })
    it ("should be able to get contacts with page", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts`)
        .query({
          size:1,
          page:2
        })
        .set('Authorization', 'test') 
  
        logger.info(response.body);
  
      expect(response.status).toBe(200)
      expect(response.body.data.length).toBe(0)
      expect(response.body.paging.current_page).toBe(2)
      expect(response.body.paging.total_page).toBe(1)
      expect(response.body.paging.size).toBe(1)
    })
   })
});
