import React from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, LineElement, PointElement, CategoryScale, Title, LinearScale, Tooltip, Filler} from 'chart.js'

import './stadistics.css';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Filler)

function getSalesByDate(start, end){
    return new Promise((resolve, reject) => {
        window.api.send('sales_by_date:fetch', start, end);
        window.api.receive('sales_by_date:fetch', async (data) => {
            resolve(data)
        })
    })
}

class SalesGraph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          options: {},
          data: {},
          actions : {},
          total: 0,

        };

        this.getComponentsForGraph = this.getComponentsForGraph.bind(this)
    }

    componentDidMount(){
        this.getComponentsForGraph()
    }

    getComponentsForGraph(){
        var currentMonth = new Date()
        var lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)

        var totalSales = []
        var grandTotalSales = 0
        getSalesByDate(lastMonth, currentMonth).then((data) => {
            data.forEach(element => {
                totalSales.push(element.total)
                grandTotalSales += element.total
            });
        }).finally(() => {
            var daylist = []

            for(let i = 0; i < totalSales.length; i++){
                daylist.push(i + 1)
            }

            const data = {
                labels: daylist,
                datasets : [
                    {
                        data : totalSales,
                        borderColor: 'rgb(255, 180, 162)',
                        backgroundColor: 'rgba(255, 180, 162, 0.5)',
                        fill : 'start',
                        lineTension : 0.4
                    },
                ],
            }
    
            const config = {
                responsive : true,
                options : {
                    plugins : {
                        interaction : {
                            intersect : false
                        }
                    }
                }
            }

            const actions = {
                handler(chart) {
                    chart.options.elements.line.tension = 0.4
                    chart.update()
                }
            }

            this.setState({
                options : config,
                data : data,
                actions : actions,
                total : grandTotalSales,
            }, () => {
                console.log("Parameters for graph gathered!")
            })
        })
    }

    render(){
        return(
            <div className="card">
                <h1 className="title-graph">Ventas</h1>
                <p className="time-lapse">Nov - Dic 2022</p>
                <h1>$<span className="total-sales">11,230</span></h1>
                <div id = "sales-graph">{
                    this.state.total != 0 ? <Line options={this.state.options} data={this.state.data}/> : null
                }</div>
            </div>
        )
    }
}

export default(SalesGraph)

