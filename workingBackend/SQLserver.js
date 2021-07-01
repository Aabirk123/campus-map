import mysql from 'mysql';
import json from 'json';

var conn = mysql.createConnection({
    host : 'game-storage.cnx2znypwgvm.us-east-2.rds.amazonaws.com',
    user : 'khimani_aq',
    password : 'Peachstate123#',
    database : 'CampusMap'
});

conn.connect(function(err){
    if(err){
        console.log(err)
    }
    else{
        console.log("connected")
    }
});

export function login(username, password, req, res){
    var loginquery = "SELECT user_id FROM users WHERE username = '"+username+"' AND password = '"+password+"'";
    conn.query(loginquery, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        } else {
            return res.json(results);
        }
    });
}

export function createAccount(username, password, req, res){
    var loginquery = "INSERT INTO users (username, password) VALUES ('"+username+"', '"+password+"')";
    conn.query(loginquery, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        } else {
            return res.json(results);
        }
    });
}

export function getBuilding(building,req, res ){
    var building_query = "SELECT * FROM buildings WHERE building_name = '"+building+"'";
    conn.query(building_query, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        }
        else{
            return res.json({
                data:results
            })
        }
    });
}

export function setClassSchedule(class_id, section_id, user_id,req, res ){
    var class_query = "INSERT INTO class_schedule (user, class) VALUES ("+user_id+", (SELECT course_id FROM classes WHERE class = '"+class_id+"' AND section = '"+section_id+"'))";
    conn.query(class_query, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        } else {
            return res.json(results);
        }
    });
}


export function getClassSchedule(user_id, req, res){
    var schedule_query = `Select s.* from class_schedule p inner join classes s
	on s.course_id = p.class
    where p.user = '${user_id}';`;
    conn.query(schedule_query, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        }
        else{
            return res.json({
                data:results
            });
        }
    });
}

export function getAllBuildings(req, res){
    var buildingQuery = "SELECT * FROM buildings INNER JOIN Images USING (building_code)";
    conn.query(buildingQuery, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        }
        else{
            return res.json({
                data:results
                
            });
        }
    });

}

export function getPhotoUrl(building_id, req, res){
    var photoQuery = `SELECT * FROM Images WHERE building_code = '${building_id}' `
    conn.query(photoQuery, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        }
        else{
            res.json({
                data:results
            });
        }
    })
}
export function getEntrances(req, res){
    var entranceQuery = "SELECT * FROM entrances";
    conn.query(entranceQuery, function(err, results){
        if(err){
            console.log(err);
            return res.send(err);
        }
        else{
            res.json({
                data:results
            });
        }
    })
}