

function createProdutRow(barcode, name, unitPrice){
    return {barcode, name, unitPrice}
}

const headCells = [
    {
        id: "barcode",
        numeric : false,
        disablePadding: true,
        label : "Codigo de Barras"
    },
    {
        id: "name",
        numeric : false,
        disablePadding: true,
        label : "Nombre"
    },
    {
        id: "unitPrice",
        numeric : true,
        disablePadding: true,
        label : "Precio Unitario"
    },
    {
        id: "quantity",
        numeric : true,
        disablePadding: true,
        label : "Cantidad"
    }
];

