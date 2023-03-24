
# Document-Management-System With Mock Test (mockingoose)


1. Create a user with 3 roles as Guest, Reviewer, and Admin
2. All the 3 users will only be able to access the APIs/Portal only after login
3. Guests will be able to upload the Document and can view their document list
4. Reviewer will review the document and approve those document
5. Admin can manage all the user, document, and configuration
6. Application should be able to handle large files (Should use stream)
7. Document URL/API should be authenticated
8. After each document submission, a notification mail should be sent to the reviewer for approval (Use Template Engine for Email Content)
9. Should follow all coding standards and write unit test cases.






## Tech Stack


**Server:** Node, Express
**DB:** Mongo DB
**Testing :** Jest


## Installation

Start the Node Server

```bash
  git clone https://github.com/naveenvigneshkumar/Document-Management-System.git 
  cd Document-Management-System
  npm install
  npm start
```

   Run Jest testing 
change the TEST_SUIT = true in env file
```bash
  cd Document-Management-System
  npm test
``` 
## 🚀 Naveen 
I'm a backend developer...

