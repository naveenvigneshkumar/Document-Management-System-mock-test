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
const mongoose = require('mongoose');
const token = [];

// jest.setTimeout(70 * 1000)

 // create a mock user
 const loginUser = {
  name: 'guest1',
  id: '9876',
  email: 'guest@yopmail.com',
  role: 'guest',
  password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
  count: 0,
  status: 'deactive',
  _id: "6406096a50beb8f723632bc7"
};

const adminUser = {
  name: 'admin',
  id: '1234',
  email: adminEmail,
  role: 'admin',
  password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
  count: 0,
  status: 'deactive',
  _id: "6406096a50beb8f723632bc7"
};

let reviewerUser = {
  name: 'reviewer1',
  id: '9877',
  email: reviewerEmail,
  role: 'reviewer',
  password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
  count: 0,
  status: 'active',
  _id: "6406096a50beb8f723632bc7"
};

beforeEach(() => {
  mockingoose.resetAll();
  token.push(jwt.sign({ id: loginUser.id, email: loginUser.email, role:loginUser.role },process.env.JWT , { expiresIn: '1h' }));
});

afterEach(() => {
  mockingoose.resetAll();
  token.length = 0;
  // jest.restoreAllMocks()
})

afterAll(()=>{
   jest.restoreAllMocks()
})

describe("Guest User Mock Test",()=>{
  it("it should add a admin",async()=>{
    // create a mock user


    // mock the User model's save method
    mockingoose(users).toReturn(adminUser, 'save');
    let registerPayload = {
      "name": "admin",
      "email": adminEmail,
      "password": "123456789",
    }
    const response = await supertest(app).post("/v1/register").send(registerPayload);
    expect(response.status).toBe(201);
  })
  it('should add a guest user',async()=>{
   

     // mock the User model's save method
     mockingoose(users).toReturn(loginUser, 'save');
     let registerPayload = {
       "name": "guest1",
       "email": 'guest@yopmail.com',
       "password": "123456789",
     }
     const response = await supertest(app).post("/v1/register").send(registerPayload);
     expect(response.status).toBe(201);
  })
  it('should be a reviewer',async()=>{
    // mock the User model's save method
    mockingoose(users).toReturn(reviewerUser, 'save');
    let registerPayload = {
      "name": "reviewer1",
      "email": 'reviewer1@yopmail.com',
      "password": "123456789",
    }
    const response = await supertest(app).post("/v1/register").send(registerPayload);
    expect(response.status).toBe(201);
  })
  it('should login to admin user',async()=>{
    // create a mock user
    const mockUser = {
      name: 'admin',
      id: '1234',
      email: adminEmail,
      role: 'admin',
      password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
      count: 0,
      status: 'active',
      _id: "6406096a50beb8f723632bc7"
    };
    mockingoose(users).toReturn(mockUser, 'findOne');
    let loginPayload = {
      email: adminEmail,
      password: "123456789"
    }
    const response = await supertest(app).post('/v1/login').send(loginPayload);
    expect(response.statusCode).toBe(200);
    expect(response._body.result.token).toBeDefined();
  })
  it('should check unknown user and return 400',async()=>{
  mockingoose(users).toReturn(null, 'findOne');
  let loginPayload = {
    email: "unknown@gmail.com",
    password: "123456789"
  }
  const response = await supertest(app).post('/v1/login').send(loginPayload);
  expect(response.statusCode).toBe(404);
  expect(response._body.result.message).toBe("user not found");
  })
  it('should upload a file from user',async()=>{
    // const testFile = fs.readFileSync(path.join(__dirname, './sample-doc.doc'));

    let mockUploadModelFile = {
      _id: '6412e45718ddaf16214d6bfd',
      id: "7777",
      filename: "1678959702829_sample-doc.doc",
      filepath: "D://NodeJs//Document-Management-System//upload//1678959702829_sample-doc.doc",
      reviewerId: {
        _id:"6406096a50beb8f723632bc7",
        name:"reviewer1",
        id:"9877",
        email: reviewerEmail
      },
      guestId: "9876",
      status: "unapproved",
      createdAt: new Date(),
      updatedAt: new Date(),
    };    
    let updateCount = {
      count: 1,
      _id: "6406096a50beb8f723632bc7"
    }
    mockingoose(users).toReturn(reviewerUser,'findOne');
    mockingoose(uploadmodel).toReturn(mockUploadModelFile, 'save');    
    mockingoose(users).toReturn(updateCount,'findOneAndUpdate');
    mockingoose(uploadmodel).toReturn(mockUploadModelFile,'findOne');
    let sampleFile = path.join(__dirname,"/sample-doc.doc");
    const response = await supertest(app).post('/v1/upload').set('Authorization', 'Bearer ' + token[0]).attach('uploadFile', sampleFile);
    expect(response.status).toBe(200);
  })
})




