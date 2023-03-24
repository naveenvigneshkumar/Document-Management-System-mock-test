const supertest = require('supertest');
// const {connect, closeDatabase, clearDatabase}= require('../db.js')
const jwt = require('jsonwebtoken')
const users = require('../model/users')
const uploadmodel = require('../model/upload')
const {baseUrl, adminEmail, reviewerEmail} = require('../../config');
const path = require('path');

const accessToken = [];
require("dotenv").config();
const {MongoClient} = require('mongodb');
const mockingoose = require('mockingoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const mongoose = require('mongoose');
const mongodbURL = process.env.TEST_SUIT == "true"?process.env.MONGO_DB_TEST:process.env.MONGO_DB


/**
 * Connect to a new in-memory database before running any tests.
 */
// beforeAll(async () => await connect());

/**
 * Clear all test data after every test.
 */
//   afterAll(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
// afterAll(async () => await closeDatabase());

beforeEach(() => {
  mockingoose.resetAll();
});

afterEach(() => {
  mockingoose.resetAll();
  // jest.restoreAllMocks()
})

afterAll(()=>{
   jest.restoreAllMocks()
})

async function uploadFile(user, file) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(file.path);
    const writeStream = fs.createWriteStream(user.profileImage);

    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', () => resolve(true));

    readStream.pipe(writeStream);
  });
}

describe("Mock Test",()=>{
  it("should add a admin user",async()=>{
    // create a mock user
    const mockUser = {
      name: 'admin',
      id: '1234',
      email: adminEmail,
      role: 'guest',
      password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
      count: 0,
      status: 'deactive',
      _id: "6406096a50beb8f723632bc7"
    };

    // mock the User model's save method
    mockingoose(users).toReturn(mockUser, 'save');

    // create a new user
    const user = new users({
      _id: '6406096a50beb8f723632bc7',
      name: 'admin',
      id: "1234",
      email: adminEmail,
      role: 'admin',
      password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
      status: "active"
    });

    // save the user
    const savedUser = await user.save();

    // assert that the saved user is equal to the mock user
    
    expect(savedUser.toJSON().email).toEqual(mockUser.email);
  })
  it("should add a reviewer user",async()=>{
    // create a mock user
    const mockUser = {
      name: 'reviewer',
      id: '1235',
      email: reviewerEmail,
      role: 'guest',
      password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
    };

    // mock the User model's save method
    mockingoose(users).toReturn(mockUser, 'save');

    // create a new user
    const user = new users({
      _id: '6406096a50beb8f723632bc7',
      name: 'admin',
      id: "12345",
      email: reviewerEmail,
      role: 'admin',
      password: '$2b$10$nxswXfSOjGbCsJbhbIBIpuLpMI0a.7Km6trsFXautP/5qKJK.6WrG',
      status: "active"
    });

    // save the user
    const savedUser = await user.save();

    // assert that the saved user is equal to the mock user
    
    expect(savedUser.toJSON().email).toEqual(mockUser.email);
  })
  it('should login a user', async () => {
    // create a mock user
    const mockUser = {
      _id: '6406096a50beb8f723632bc7',
      name: 'admin',
      email: adminEmail,
      password: await bcrypt.hash('123456789', 10)
    };

    // mock the User model's findOne method
    mockingoose(users).toReturn(mockUser, 'findOne');

    // call the login method on the User model
    const user = await users.login(adminEmail, '123456789');

    expect(user.toJSON().email).toEqual(mockUser.email);
  })
  it('should upload a file from user', async()=>{
    const mockUploadModel = {
      _id: '6412e45718ddaf16214d6bfd',
      id: "7777",
      filename: "1678959702829_sample-doc.doc",
      filepath: "D:/NodeJs/Document-Management-System/upload/1678959702829_sample-doc.doc",
      reviewerId: "640637c69dddd8adcba93dd0",
      guestId: "8999",
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    
    mockingoose(uploadmodel).toReturn(mockUploadModel, 'findOne');

    const mockFile = {
      originalname: 'sample-doc.doc',
      path: 'D:/NodeJs/Document-Management-System/upload/1678959702829_sample-doc.doc',
    };
    const uploadModel = await uploadmodel.findOne({ id: '7777' });
    uploadModel.profileImage = mockFile.path;
    await uploadModel.save();

    const updatedUser = await uploadmodel.findOne({ id: '7777' });

    expect(updatedUser.filepath).toBe(mockFile.path);
  
    const result = await uploadFile(uploadModel, mockFile);
  
    expect(result).toBeTruthy();
    
  })
  it('should update the doc status cases',async()=>{
    const mockUploadModel = {
      _id: '6412e45718ddaf16214d6bfd',
      id: "7777",
      filename: "1678959702829_60MB_test_Original_PDF_from_Kirtas.pdf",
      filepath: "D:\\NodeJs\\Document-Management-System\\src\\controller\\upload\\1678959702829_60MB_test_Original_PDF_from_Kirtas.pdf",
      reviewerId: "640637c69dddd8adcba93dd0",
      guestId: "8999",
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockingoose(uploadmodel).toReturn(mockUploadModel, 'findOneAndUpdate');

    const  updateDocStatus = await uploadmodel.findOneAndUpdate(
      { id: '7777' }, 
      { status: 'approved' }, 
      { new: true } 
    );
      expect(updateDocStatus.status).toBe('approved');
  })
  it("should get specific doc",async()=>{
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
    mockingoose(uploadmodel).toReturn(mockUploadModel, 'findOne');
    const user = await uploadmodel.findOne({id:'7777'});

    expect(user.toJSON().filename).toEqual(mockUploadModel.filename);
  })
  it("should give list of doc from guest user",async()=>{
    let docList = [
      { 
        id: '7777',       
        filename: '1678959702829_60MB_largefile.pdf',
        filepath: 'D:\\NodeJs\\Document-Management-System\\src\\controller\\upload\\1678959702829_60MB_largefile.pdf',
        guestId: '7698',
        status: 'approved',
        "_id": "641d738e9d331bd960dee212",
      },
      { 
        id: "4634",
        filename: "1678959702829_60MB_largefile.pdf",
        filepath: "D:\\NodeJs\\Document-Management-System\\src\\controller\\upload\\1678959702829_60MB_largefile.pdf",
        guestId: "7698",
        status: "approved",
        "_id": "641d738e9d331bd960dee213",
      },
      { 
        id: "3000",
        filename: "1678959702829_60MB_largefile.pdf",
        filepath: "D:\\NodeJs\\Document-Management-System\\src\\controller\\upload\\1678959702829_60MB_largefile.pdf",
        guestId: "7698",
        status: "unapproved",
        "_id": "641d738e9d331bd960dee214",
      }
      ];
      mockingoose.uploadmodel.toReturn(docList, 'find');
      const uploadmodelList = await uploadmodel.find({guestId: 7698}).select('_id status');
      uploadmodelList.forEach(list=>{
        expect(list.toJSON()).toEqual(expect.objectContaining({
          _id: expect.any(mongoose.Types.ObjectId),
          status: expect.any(String),
        }))
      })
  })
})


// describe("Mock Test cases",()=>{
//   let connection;
//   let db;
//   beforeAll(async () => {
//     connection = await MongoClient.connect(mongodbURL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = connection.db('document_managment_test');
//   })
//   afterAll(async () => {
//     await connection.close();
//   })
//   it("adding user test cases",async()=>{
//     let mockUser = {
//       name: "admin",
//       email: adminEmail,
//       password: "$2b$10$exmxN84hY/7C478DpogtFeGli.3E.er9ktQ1KV8KXwyPGLRLz9J5u",
//       id: "1234",
//       status:"active"
//     }
//     const usersModel = db.collection('users');
//     await usersModel.insertOne(mockUser);
//     const insertedUser = await usersModel.findOne({id: '1234'});
    
//     expect(insertedUser.email).toBe(mockUser.email);
//   })
  
// })

// describe("adminregister",()=>{
    
//     describe("add admin login",()=>{
//         it('it should return 201',async()=>{
//             let registerPayload = {
//                     "name": "admin",
//                     "email": adminEmail,
//                     "password": "123456789",
//             }
//             const res = await supertest(baseUrl).post("v1/register").send(registerPayload);
            
//             expect(res.statusCode).toBe(201);
//         })
//     })


//     describe("add guest user",()=>{
//         it('it should return 201',async()=>{
//             let registerPayload = {
//                     "name": "guest2",
//                     "email": "guest2@yopmail.com",
//                     "password": "123456789",
//             }
            
//             const res = await supertest(baseUrl).post("v1/register").send(registerPayload);
            
//             expect(res.statusCode).toBe(201);
//         })
//     })

//     describe("add reviewer user",()=>{
//         it('it should return 201',async()=>{
//             let registerPayload = {
//                     "name": "reviewer1",
//                     "email": reviewerEmail,
//                     "password": "123456789",
//             }
            
//             const res = await supertest(baseUrl).post("v1/register").send(registerPayload);
            
//             expect(res.statusCode).toBe(201);
            
//         })
//     })
// })

//  describe("adminlogin",()=>{ 
//     describe('give correct admim login and generate token',()=>{
//         it('login admin',async()=>{
//             let loginPayload = {
//                                 email: adminEmail,
//                                 password: "123456789"
//                             }
//             const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
//             expect(res.statusCode).toBe(200);
//             accessToken.push({'adminToken': res._body.result.token});
//         })
//     })
//     describe('Update guest user status',()=>{
//         it('update status api',async()=>{
//             let findUser = await users.findOne({email:"guest2@yopmail.com"}).select('id status');
//             const res = await supertest(baseUrl).put(`v1/admin/update/user?id=${findUser.id}`).set('Authorization', 'Bearer ' + accessToken[0].adminToken).send({"status":"active"});
//             expect(res.statusCode).toBe(200);
//         })
//     })
//     describe('Update reviewer user status',()=>{
//         it('update status api',async()=>{
//             let findUser = await users.findOne({email:reviewerEmail}).select('id status');
//             const res = await supertest(baseUrl).put(`v1/admin/update/user?id=${findUser.id}`).set('Authorization', 'Bearer ' + accessToken[0].adminToken).send({"status":"active", "role":"reviewer"});
//             expect(res.statusCode).toBe(200);
//         })
//     })
//  });


// describe("login as guest user",()=>{
//     const accessToken = [];
//     describe("give correct payload and generate token",()=>{
//         it("should return 200",async ()=>{
//             let upd = await users.findOneAndUpdate({email:"guest2@yopmail.com"},{$set:{status:"active"}});
//             let loginPayload = {
//                                 email: "guest2@yopmail.com",
//                                 password: "123456789"
//                             }
//             const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
             
//             expect(res.statusCode).toBe(200);
//             accessToken.push({'guestToken': res._body.result.token})
//         })
//     })
    
//     describe("give incorrect payload",()=>{
//         it("it should return 404",async()=>{
//             let loginPayload = {
//                 email: "unknown@yopmail.com",
//                 password: "123456789"
//             }
//             const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
            
//             expect(res.statusCode).toBe(404);
            
//         })
//     })

//     describe("upload file",()=>{
//         it("it should return 200",async()=>{
//             let sampleFile = path.join(__dirname,"/sampleFile/sample-doc.doc");
           
//             const res = await supertest(baseUrl).post('v1/upload').set('Authorization', 'Bearer ' + accessToken[0].guestToken).attach('uploadFile', sampleFile);
           
//             expect(res.statusCode).toBe(200);
//         })
//     })

//  });


// describe('login as reviewer',()=>{
//     describe("login as reviewer and generate token",()=>{
//         it('it should return 200',async()=>{
//             let loginPayload = {
//                 email: reviewerEmail,
//                 password: "123456789"
//             }
//             const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
//             expect(res.statusCode).toBe(200);
//             accessToken.push({'reviewerToken': res._body.result.token});            
//         })
//     })

//     describe("change doc status",()=>{
//         it('update doc status by reviewer',async()=>{
//             let findreviewer = await users.findOne({email:reviewerEmail}).select('_id');
//             let findApproveList = await uploadmodel.findOne({reviewerId: findreviewer, status: "unapproved"}).select('id')
//             const res = await supertest(baseUrl).put(`v1/review/status?file=${findApproveList.id}`).set('Authorization', 'Bearer ' + accessToken[0].reviewerToken).send({ "action": "approved"})
//         })
//     })
// })


