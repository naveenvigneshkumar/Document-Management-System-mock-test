const supertest = require('supertest');
const app = require('../app')
// const {connect, closeDatabase, clearDatabase}= require('../db.js')
const jwt = require('jsonwebtoken')
const users = require('../model/users')
const uploadmodel = require('../model/upload')
const {baseUrl, adminEmail, reviewerEmail} = require('../../config');
const path = require('path');

const mockingoose = require('mockingoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const token = [];
// Set up mock data
const user = new users({
    name: 'reviewer1',
    id: '1234',
    email: reviewerEmail,
    role: 'reviewer',
    password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
    count: 0,
    status: 'active',
    _id: "640637c69dddd8adcba93dd0"
  });

const mockUploadModel = {
    _id: '6412e45718ddaf16214d6bfd',
    id: "7777",
    filename: "1678959702829_60MB_largefile.pdf",
    filepath: "D:\\NodeJs\\Document-Management-System\\src\\controller\\upload\\1678959702829_60MB_largefile.pdf",
    reviewerId: "640637c69dddd8adcba93dd0",
    guestId: "8999",
    status: "approved",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docList =  [
    {
      _id: '6412e45718ddaf16214d6bfd',
      id: "7777",
      filename: "1678959702829_sample-doc.doc",
      filepath: "D://NodeJs//Document-Management-System//upload//1678959702829_sample-doc.doc",
      reviewerId: "6406096a50beb8f723632bc7",
      guestId: "9876",
      status: "approved",
    },
    {
      _id: '6412e45718ddaf16214d6bff',
      id: "7776",
      filename: "1678959702829_sample-doc1.doc",
      filepath: "D://NodeJs//Document-Management-System//upload//1678959702829_sample-doc1.doc",
      reviewerId: "6406096a50beb8f723632bc7",
      guestId: "9876",
      status: "approved",
    },
    {
      _id: '6412e45718ddaf16214d6bfg',
      id: "7774",
      filename: "1678959702829_sample-doc2.doc",
      filepath: "D://NodeJs//Document-Management-System//upload//1678959702829_sample-doc2.doc",
      reviewerId: "6406096a50beb8f723632bc7",
      guestId: "9876",
      status: "approved",
    }
  ]
  

beforeEach(() => {
    mockingoose.resetAll();
      token.push(jwt.sign({ id: user.id, email: adminEmail, role:user.role },process.env.JWT , { expiresIn: '1h' }));
  });
  
  afterEach(() => {

    mockingoose.resetAll();
    token.length = 0;
    // jest.restoreAllMocks()
  })
  
  afterAll(()=>{
     jest.restoreAllMocks()
  })


describe("Reviewer Mock Test",()=>{
    it('should update doc',async()=>{
        const status =new uploadmodel({
            _id: '6412e45718ddaf16214d6bfd',
            id: "7777",
            filename: "1678959702829_60MB_test_Original_PDF_from_Kirtas.pdf",
            filepath: "D:\\NodeJs\\Document-Management-System\\src\\controller\\upload\\1678959702829_60MB_test_Original_PDF_from_Kirtas.pdf",
            reviewerId: "640637c69dddd8adcba93dd0",
            guestId: "8999",
            status: "unapproved",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          const updatStatus =new uploadmodel({
            _id: '6412e45718ddaf16214d6bfd',
            id: "7777",
            filename: "1678959702829_60MB_test_Original_PDF_from_Kirtas.pdf",
            filepath: "D:\\NodeJs\\Document-Management-System\\src\\controller\\upload\\1678959702829_60MB_test_Original_PDF_from_Kirtas.pdf",
            reviewerId: "640637c69dddd8adcba93dd0",
            guestId: "8999",
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          // Mock the User and Status models
          mockingoose(users).toReturn(user, 'findOne');
          mockingoose(uploadmodel).toReturn(status, 'findOne');
          mockingoose(uploadmodel).toReturn(updatStatus, 'findOneAndUpdate')
          const response = await supertest(app).put("/v1/review/status?file=7777").set('Authorization', 'Bearer ' +token[0]).send({
            "action": "approved"
          });
          expect(response.status).toBe(200);
    })
    it('should get single doc',async()=>{
       
        mockingoose(uploadmodel).toReturn(mockUploadModel, 'findOne');
        let response = await  supertest(app).get(`/v1/review/get/doc?file=7777`).set('Authorization', 'Bearer ' +token[0]) 
        expect(response.status).toBe(200);
    })
    it('should all doc list',async()=>{
        mockingoose(uploadmodel).toReturn(docList, 'find');
        let response = await  supertest(app).get(`/v1/review/get/reviewer/list?action=approved`).set('Authorization', 'Bearer ' +token[0]) 
        expect(response.status).toBe(200);
    })
});