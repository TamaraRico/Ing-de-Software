import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import './stadistics.css';

function getSellsByEmployee(employee_name, starDate, endDate){
    return new Promise((resolve, reject) => {
        window.api.send('sells:getByEmployee', employee_name, starDate, endDate);
        window.api.receive('sells:getEmployee', async (data) => {
            resolve(data)
        })
    })
}

function getUsers() {
    return new Promise((resolve, reject) => {
      window.api.send("users:findAllUsers");
  
      window.api.receive("users:getAllUsers", (data) => {
        resolve(data);
      });
    });
}

class EmployeeStadistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          optionsT: {},
          dataT: {},
          update : 0,
          employee_name : "",
          startWeek : "",
          currentWeek : "",
          employees: []
        };
        this.getComponentsForGraph = this.getComponentsForGraph.bind(this)
    }

    componentDidMount(){
        const usersArray = []
        getUsers().then((data) =>{
            const dataUser = JSON.parse(data);
            dataUser.forEach( (user) => {
                if(user.role == 'employee'){
                    usersArray.push(user.name)
                }
            })
        }).finally(() => {
            this.setState({
                employees : usersArray
            },  () => {
                console.log("employees gathered!")
            })
        })
    }

    getComponentsForGraph(e){
        var currentWeek = new Date()
        var lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 7)

        var totalTraffic= []
        var daylist = []
        getSellsByEmployee(e.target.value, lastWeek, currentWeek).then((data) => {
            data.forEach(element => {
                console.log(data)
                totalTraffic.push(element.total)
                daylist.push(new Date(element.factured_date).toLocaleDateString())
            });
        }).finally(() => {
            const data2 = {
                labels: daylist,
                datasets : [
                    {
                        label : 'Venta por dia',
                        data : totalTraffic,
                        backgroundColor: 'rgb(255, 180, 162)',
                        fill: 'start',
                        lineTension : 0.4
                    },
                ],
            }
    
            const config2 = {
                responsive: true,
                maintainAspectRatio: false,
                options : {
                    plugins : {
                        interaction : {
                            intersect : false
                        }
                    }
                },
                scales: {
                    x: {
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      grid: {
                        display: false
                      }
                    }
                  },
            }
            this.setState({
                optionsT : config2,
                dataT : data2,
                employee_name : e.target.value,
                startWeek: lastWeek.toDateString(),
                currentWeek : currentWeek.toDateString(),
                update: 1,
            }, () => {
                console.log("Parameters for graph gathered!")
            })
        })
    }

    render(){
        return(
            <div className="graph-card">
                <TextField id="employee" select label="Select" value={this.state.employee_name} onChange={this.getComponentsForGraph} helperText="Estadisticas para empleado">{
                    this.state.employees.map((employee) => (
                        <MenuItem key={employee} value={employee}>
                            {employee}
                        </MenuItem>
                    ))
                }</TextField>
                <div id="sales-graph">{
                    this.state.update != 0 ? <Line id="2" options={this.state.optionsT} data={this.state.dataT} updateMode = "resize" redraw = 'true'/> : null
                }</div>
            </div>
        )
    }
}

export {EmployeeStadistics}