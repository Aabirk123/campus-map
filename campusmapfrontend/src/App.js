import React from 'react';
import './App.css';
import MapContainer from './Map.js' // import the map here
import SplitPane from 'react-split-pane';
import Select from 'react-select';
import Modal from './Modal.js'

class App extends React.Component
{
  state = {
    start: {},
    end: {},
    buildings: [],
    selectedStartOption: null,
    selectedEndOption: null,
    descriptionInfo: null,
    user_id: null,
    isLoginModalOpen: false,
    showLoginError: false,
    username: null,
    password: null,
    isClassScheduleModalOpen: false,
    userClasses: [],
    courseid: null,
    sectionid: null,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.username !== this.state.username || nextState.password !== this.state.password || nextState.courseid !== this.state.courseid || nextState.sectionid !== this.state.sectionid  ) {
      if(nextState.username === null && nextState.password === null)
        return true;

      return false;
    }
    return true;
  }

  componentDidMount() {
    this.getData('/get_all_buildings').then(data => {
      var currBuildings = this.state.buildings;
      for(var i = 0; i < data.data.length; i++) {
        currBuildings.push({value: data.data[i].building_code, label: data.data[i].building_name, descriptionInfo:{ descriptionText: data.data[i].description, descriptionImage: data.data[i].img_file}});
      }
      this.setState({ ...this.state, buildings: currBuildings });
    });

    this.updateData = this.updateData.bind(this);
    this.objectToQueryString = this.objectToQueryString.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.putData = this.putData.bind(this);
    this.textFieldDidChange = this.textFieldDidChange.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.getClassScheduleData = this.getClassScheduleData.bind(this);
    this.setClassScheduleData = this.setClassScheduleData.bind(this);

  }

    async postData(url = '', data = {})
    {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.json();
    }

    async putData(url = '', data = {})
    {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response.json();
    }

    async getData(url = '', data = {})
    {
      const response = await fetch(((data != null) ? url+"?"+this.objectToQueryString(data) : url), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    }

    objectToQueryString(obj) {
      return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    }


  updateData()
  {
    var start = this.state.selectedStartOption != null ? this.state.selectedStartOption.label : null;
    var end = this.state.selectedEndOption != null ? this.state.selectedEndOption.label : null;

    if(start) {
      this.getData('/get_building', { building: start })
      .then(data =>
      {
          if (data.data !== null && data.data.length !== 0)
          {
              var temp =
              {
                  lat: data.data[0].latitude,
                  lng: data.data[0].longitude
              }
              this.setState({...this.state, start: temp});
          }
      });
    }

    if(end) {
      this.getData('/get_building', { building: end })
      .then(data =>
      {
          if (data.data !== null && data.data.length !== 0)
          {
              var temp =
              {
                  lat: data.data[0].latitude,
                  lng: data.data[0].longitude
              }
              this.setState({...this.state, end: temp});
          }
      });
    }
  }

  textFieldDidChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({...this.state, [nam]: val});
  }

  login = () => {
    this.postData('/login', { username: this.state.username, password: this.state.password })
      .then(data =>
      {
          if (data.data !== null && data.length !== 0)
          {
              this.setState({...this.state, user_id: data[0].user_id, isLoginModalOpen: false, showLoginError: false});
          } else {
            this.setState({...this.state, showLoginError: true});
          }
      });
  }

  logout = () => {
    this.setState({...this.state, user_id: null, username: null, password: null});
  }

  createAccount = () => {
    this.putData('/createAccount', { username: this.state.username, password: this.state.password })
      .then(data =>
      {
          if (data.insertId !== null && data.affectedRows > 0)
          {
              this.setState({...this.state, user_id: data.insertId, isLoginModalOpen: false, showLoginError: false});
          } else {
            this.setState({...this.state, showLoginError: true});
          }
      });
  }

  getClassScheduleData = () => {
    this.getData('/get_class_schedule', { id: this.state.user_id })
      .then(data =>
      {
          if (data.data !== null && data.data.length !== 0)
          {
            this.setState({...this.setState, userClasses:data.data})
            
          }
      })
  }

  setClassScheduleData = () => {
    this.putData('/set_class_schedule', { userid: this.state.user_id, courseid: this.state.courseid, sectionid: this.state.sectionid })
      .then(data =>
      {
          if (data.insertId !== null && data.affectedRows > 0)
          {
            this.setState({...this.state, courseid: null, sectionid: null, userClasses: []})
            this.getClassScheduleData();
            var coursefield = document.getElementById("courseid");
            var sectionfield = document.getElementById("sectionid");
            coursefield.value = "";
            sectionfield.value = "";
          }
      })
  }

  handleStartChange = (selectedOption) => {
    this.setState({ ...this.state, selectedStartOption: selectedOption, descriptionInfo: selectedOption.descriptionInfo }, this.updateData);
  }

  handleEndChange = (selectedOption) => {
    this.setState({ ...this.state, selectedEndOption: selectedOption, descriptionInfo: selectedOption.descriptionInfo }, this.updateData);
  }

  render()
  {
    var coords = [this.state.start, this.state.end];

    return (
      <div>
      <SplitPane split="vertical" minSize={50} defaultSize={300}>
        <div>
          <button onClick={this.state.user_id != null ? this.logout : () => this.setState({...this.state, isLoginModalOpen: true}) }>
              { this.state.user_id != null ? "Logout" : "Login"}
          </button>
          {
            this.state.isLoginModalOpen ?
            <div>
            <input type="text" name="username" onChange={this.textFieldDidChange}/>
            <input type="text" name="password" onChange={this.textFieldDidChange}/>
            <button onClick={this.login}>
              Login
            </button>
            <button onClick={this.createAccount}>
              Create Account
            </button>
            {
              this.state.showLoginError ?
              <p>Wrong username or password!</p>
              : null
            }
            </div>
            : null
          }
          { this.state.user_id != null ? 
            <button onClick={() => { this.getClassScheduleData(); this.setState({...this.state, isClassScheduleModalOpen: true})}}>
                Class Schedule
            </button> :
            null
          }
          <h1>Start</h1>
            <Select
              value={this.state.selectedStartOption}
              onChange={this.handleStartChange}
              options={this.state.buildings}
              id="start"
            />
          <h1>End</h1>
            <Select
                value={this.state.selectedEndOption}
                onChange={this.handleEndChange}
                options={this.state.buildings}
                id="end"
              />
          <br/>
          {
            this.state.descriptionInfo ?
            <div>
              <img src={this.state.descriptionInfo.descriptionImage} alt=""/>
              <h1>Description:</h1>
              <p>{this.state.descriptionInfo.descriptionText}</p>
            </div>
            : null
          }

        </div>
        <div>
          <MapContainer
            key = {(new Date()).getTime()}
            data={coords}
            center={{lat: 32.8288, lng: -83.6498}}
            zoom={18}
            //style={{width: '400px', height: '400px'}}
          />
        </div>
      </SplitPane>
      <Modal show={this.state.isClassScheduleModalOpen} handleClose={() => this.setState({...this.state, isClassScheduleModalOpen: false})}>
        <h2>My Class Schedule</h2>
        <table style={{width:'100%'}}>
        <tbody>
          <tr>
            <th>Course Id</th>
            <th>Section Id</th> 
            <th>Building</th>
            <th>Route?</th>
          </tr>
            {
              this.state.user_id && this.state.isClassScheduleModalOpen ? this.state.userClasses.map((row, index) => {
                // eslint-disable-next-line
                return <tr key={row.course_id}><td>{row.class}</td><td>{row.section}</td><td>{this.state.buildings.filter(i => i.value === row.building_fk)[0].label}</td><td><a href="javascript:;" onClick={() => this.handleEndChange(this.state.buildings.filter(i => i.value === row.building_fk)[0])}>Route Me</a></td></tr>
              }) : null
            }
            <tr>
              <td><input id="courseid" type="text" name="courseid" onChange={this.textFieldDidChange}/></td>
              <td><input id="sectionid" type="text" name="sectionid" onChange={this.textFieldDidChange}/></td>
            </tr>
          </tbody>
        </table>
        <div className="form-group">
          <button onClick={() => this.setClassScheduleData()} type="button">
            Add
          </button>
        </div>
      </Modal>
    </div>
    );
  }
}

export default App;