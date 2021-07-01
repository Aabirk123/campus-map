import njwt from 'njwt';
import * as sqlServerObject from './SQLServerAccess.js';
const fetch = require("node-fetch");

const SELECT_ALL_DEFAULT_QUERY = 'SELECT LoginName, Pass, StudentID FROM LoginC';
export var users = {};

// export function getsql(req, res)  {
//     this.users = sqlServerObject.getUserData(SELECT_ALL_DEFAULT_QUERY, res, req);
//     return sqlServerObject.getUserData(SELECT_ALL_DEFAULT_QUERY, res, req);
// };


const {
    APP_SECRET = 'Thisismysupersecret123456789secret.youmaynotaccess',
    APP_BASE_URL = 'http://localhost:4000'
  } = process.env;
  
export function encodeToken(tokenData) {
    return njwt.create(tokenData, APP_SECRET).compact();
}

export function decodeToken(token) {
    return njwt.verify(token, APP_SECRET).body;
}

export const clientAuthenticationMiddleware = (req, res, next) => {
    const token = req.header('Access-Token');
    if (!token) {
      return next();
    }
  
    try {
      const decoded = decodeToken(token);
      const { userId } = decoded;
  
      console.log('decoded', decoded);
      console.log('userId', userId);
  
      if (users.find(user => user.id === userId)) {
        console.log('found user!');
        req.userId = userId;
      }
    } catch (e) {
      return next();
    }
  
    next();
};

export async function isAuthenticatedMiddleware(req, res, next) {
    if (req.userId) {
      return next();
    }
  
    res.status(401);
    res.json({ error: 'User not authenticated' });
};

// This endpoint generates and returns a JWT access token given authentication
// data.
export async function clientLogin(req, res) {
    console.log("ACCESSING SERVER: Request: ", req.body);

    await fetch('http://10.0.1.167:4000/users')
    .then(response => response.json())
    .then(json => {
        users = json;
    });
    const { muid, password } = req.body;
    const user =  users.data.recordsets[0].find(user => user.LoginName === muid && user.Pass === password);
    console.log(user);
    if (!user) {
      res.status(401);
      return res.json({ error: 'Invalid email or password' });
    }
  
    const accessToken = encodeToken({ userId: user.StudentID });
    const MercerID = user.StudentID;
    return res.json({ accessToken, MercerID });
}