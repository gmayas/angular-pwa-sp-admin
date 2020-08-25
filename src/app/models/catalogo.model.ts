export class catalogoModel{

    constructor(id = 0, grupo ='', claveart ='', articulo ='', urlimagen ='', impuesto = 0, precio = 0){
        this.id = id;
        this.grupo = grupo;
        this.claveart = claveart;
        this.articulo = articulo;
        this.urlimagen = urlimagen; 
        this.impuesto = impuesto;
        this.precio = precio;
    }

    id: number;
    grupo: string;
    claveart: string;
    articulo: string;
    urlimagen: string; 
    impuesto: number;
    precio: number;
};