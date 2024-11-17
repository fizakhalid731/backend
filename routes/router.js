const express = require('express');
const route = express.Router();
const authenticate = require('../middleware/authentication.js');
const Controller = require('../controlers/controller.js')




route.post("/api/signup", Controller.sign_up );

route.post("/api/login", Controller.login );

route.post('/api/posts', authenticate.authenticate, Controller.addpost );

route.get('/api/posts', authenticate.authenticate, Controller.fetchpost);

route.put('/api/posts/:id', authenticate.authenticate, Controller.updatepost);

route.delete('/api/posts/:id', authenticate.authenticate, Controller.deletepost);

route.get('/api/posts/other', authenticate.authenticate, Controller.fetchallPost);

route.get('/api/user', authenticate.authenticate, Controller.getuserInfo);

route.put('/api/user', authenticate.authenticate, Controller.updateUserInfo);



module.exports = route;