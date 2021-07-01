const express = require('express');
const cors = require('cors');
const mssql = require('mssql');
const fetch = require("node-fetch");

const app = express();

var config  = {
    server            : 'csdata.cd4sevot432y.us-east-1.rds.amazonaws.com',
    user            : 'csc312cloud',
    password        : 'c3s!c2Cld',
    database        : 'CIS-C'
};
  

function getUserIdFromAuthenticatedRequest(req) {
    return req.userId;
}

mssql.connect(config, function(err) {
    if(err)
        console.log(err);
})

app.use(cors());

export async function getUserData(sqlQuery, res, req) {
    var request = new mssql.Request();
    request.query(sqlQuery, function (err, results) {
        if(err) {
            return res.send(err);
        } else {
            
            return res.json({
                data: results
            });
        }
        
    })
}


app.get('/users/query', (req, res) => {
    const { username, password } = req.query;
    const QUERY_USERS = "SELECT StudentID, ProfID FROM LoginC WHERE LoginName = '"+username+"' AND Pass = '"+password+"'";
    console.log(QUERY_USERS);
    var request = new mssql.Request();
    request.query(QUERY_USERS, function (err, results) {

        if(err) {
            return res.send(err);
        } else {
            return res.json({
                data: results
            });
        }
        
    });
});


