import express from 'express';
import * as sqlfunctions from './SQLserver.js';

const app = express();
app.use("/images",express.static('images'))

app.listen(8080, () => console.log("Listening on port 8080"));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

app.get('/tables', (request, response) => {
    return sqlfunctions.getTables(request, response);
});

app.post('/login', (request, response) => {
    var { username, password } = request.body;
    return sqlfunctions.login( username, password, request, response);
});

app.put('/createAccount', (request, response) => {
    var { username, password } = request.body;
    return sqlfunctions.createAccount( username, password, request, response);
});

app.get('/get_building', (request, response) => {
    var building = request.query.building;
    return sqlfunctions.getBuilding(building, request, response);
});

app.get('/get_class_schedule',(request,response) =>{
    var user_id = request.query.id;
    return sqlfunctions.getClassSchedule(user_id, request, response);
});

app.put('/set_class_schedule',(request,response) =>{
    var user_id = request.body.userid;
    var course_id = request.body.courseid;
    var section_id = request.body.sectionid;
    return sqlfunctions.setClassSchedule(course_id, section_id, user_id, request, response);
});

app.get('/get_all_buildings', (request, response) =>{
    return sqlfunctions.getAllBuildings(request, response)
});

app.get('/getPhoto', (request, response) =>{
    var building_code = request.query.building_code;
    return sqlfunctions.getPhotoUrl(building_code, request, response)
})
app.get('/get_entrances',(request, response) =>{
   return sqlfunctions.getEntrances(request, response);
})
