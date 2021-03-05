import { Articulo } from 'src/app/models/articulo.model';

export class DetalleVentaFactura {


    public cantidad: number;
    public valorUnitario: number;
    public valorIva: number;
    public valorDescuento: number;
    public valorExentoArticulo: number;
    public valorArticulo: number;
    public articulo: Articulo;
    public id: number;
    public idventa: number;

    public idarticulo: number;
    public nombre: string;
    public pos: number;
    public valorBase: number;


    constructor() {

    }

    isValid() {
        let isValid = true;

        Object.keys(this).forEach(key => {
            if (key !== 'valorBase' && key !== 'idventa' && key !== 'pos') {
                if (this[key] === undefined) {
                    isValid = false;
                    return;
                } else if (['cantidad'].includes(key) && this[key] === 0) {
                    isValid = false;
                    return;
                }
            }
        });
        return isValid;

    }
}
