export class DetalleFacturProveedor {

    constructor(
        public idfactura?: number,
        public idarticulo?: number,
        public cantidad?: number,
        public valorcompra?: number,
        public valorventa?: number,
        public pos?: number,
        public bonificacion?: boolean
    ) {
    }
}
