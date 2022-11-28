import React from 'react';

var user = null;
var pass = null;
var startTime = null;
var stopTime = null;

function getSalesByDate(start, end){
    return new Promise((resolve, reject) => {
        window.api.send('sales_by_date:fetch', start, end);
        window.api.receive('sales_by_date:fetch', async (data) => {
            resolve(data)
        })
    })
}

function getProduct(barcode){
    return new Promise((resolve, reject) => {
        window.api.send('product:getByBarcode', barcode);
        
        window.api.receive('product:getOne', (data) => {
            resolve(data);
        });
	})
}

function getActiveEmployee(){
    if((user != '') && (pass != '')) {
        window.api.send('user:load',user);
        window.api.receive('user:get', (data) => {
            const data2 = JSON.parse(data);
            if(data2.role == 'employee'){
                startTime = data2.entrada;
                stopTime  = data2.salida;
            }
        });
    }
}

function corteDeCajaEnX(){
    var elementosComprados = []
    getActiveEmployee();
    getSalesByDate(startTime, stopTime).then((data) => {
        data.forEach(element => {
            var productBarcode = element.purchased_products.products.barcode;
            var cantidadDelProducto = element.purchased_products.products.quantity;
            var productName = null;
            var price = null;
            getProduct(productBarcode).then((data) => {
                if (data !== "null") {
                  const product = JSON.parse(data);
                  productName = product.name
                  price = product.priceUnit
                }
            });
            const obj = data.find()
            if(obj != null){
                var cantidadComprada = obj.cantidad
                obj.
            }

            var precioTotal = cantidadDelProducto * price;
            var p = {
                nombre : productName,
                cantidad : cantidadDelProducto,
                total : precioTotal
            };
            elementosComprados.push(p);
            })
        });
    .finally(() => {

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
    })
}

function corteDeCajaEnZ(){

}