import { Iva } from './iva.model';
import { Unidad } from './unidad.model';
import { TipoArticulo } from './tipo-articulo.model';
import { Presentacion } from './presentacion.model';

export class Articulo {

    constructor(
        public nombreGenerico: string,
        public nombreComercial: string,
        public presentacion: Presentacion,
        public valorCompra: number,
        public valorVenta: number,
        public unidadCompra: Unidad,
        public conversion: number,
        public unidadVenta: Unidad,
        public iva: Iva,
        // public descuento: string,
        public tipoArticulo: TipoArticulo,
        public referencia: string,
        public existencias: number,
        public existenciasMinimas: number,
        public activo: boolean,
        public id?: number
    ) {

    }

    get unidadcompra() {
        return this.unidadCompra;
    }

    get unidadventa() {
        return this.unidadVenta;
    }

    get tipoarticulo() {
        return this.tipoArticulo;
    }

    get nombrepresentacion() {
        console.log(this.nombreComercial, this.presentacion.nombre);

        return this.nombreComercial + ' x ' + this.presentacion.nombre;
    }

}
