import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'

import './stadistics.css';

function getSalesByDate(start, end){
    return new Promise((resolve, reject) => {
        window.api.send('sales_by_date:fetch', start, end);
        window.api.receive('sales_by_date:fetch', async (data) => {
            resolve(data)
        })
    })
}

class TrafficGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          optionsT: {},
          dataT: {},
          update : 0,
          startWeek : "",
          currentWeek : "",
        };
        this.getComponentsForGraph = this.getComponentsForGraph.bind(this)
    }

    componentDidMount(){
        this.getComponentsForGraph()
    }

    getComponentsForGraph(){
        var currentWeek = new Date()
        var lastWeek = new Date()
        lastWeek.setDate(lastWeek.getDate() - 7)

        var totalTraffic= []
        var daylist = []
        getSalesByDate(lastWeek, currentWeek).then((data) => {
            data.forEach(element => {
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
                <h1 className="title-graph">Estadistica de trafico</h1>
                <p className="time-lapse">{this.state.startWeek} - {this.state.currentWeek}</p>
                <div id="sales-graph">{
                    this.state.update != 0 ? <Line id="2" options={this.state.optionsT} data={this.state.dataT} updateMode = "resize" redraw = 'true'/> : null
                }</div>
            </div>
        )
    }
}

export {TrafficGraph}