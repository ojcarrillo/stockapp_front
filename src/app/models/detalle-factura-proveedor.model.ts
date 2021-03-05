import { Articulo } from './articulo.model';
export class DetalleFacturProveedor {

    public articulo: Articulo;

    constructor(
        public idfactura?: number,
        public idarticulo?: number,
        public cantidad?: number,
        public valorCompra?: number,
        public valorVenta?: number,
        public pos?: number,
        public bonificacion: boolean = false,
        public nombre?: string
    ) {
    }

    isValid() {
        let isValid = true;
        if (this.bonificacion === true) {
            if (this.idarticulo === undefined ||
                (this.cantidad === undefined || this.cantidad === 0)) {
                return false;
            }
        } else {
            Object.keys(this).forEach(key => {
                if (key !== 'bonificacion' && key !== 'idfactura' && key !== 'pos') {
                    if (this[key] === undefined) {
                        isValid = false;
                        return;
                    } else if (['cantidad', 'valorcompra', 'valorventa'].includes(key) && this[key] === 0) {
                        isValid = false;
                        return;
                    }
                }
            });
            return isValid;
        }
        return true;
    }
}
