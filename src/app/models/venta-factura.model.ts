import { DetalleVentaFactura } from './detalle-venta-factura.model';
import { PagoFactura } from './pago-factura.model';

export class Venta {

    public comprador: string;
    public documentoComprador: string;
    public numeroFactura: string;
    public valorIva: number;
    public valorFactura: number;
    public exentoFactura: number;
    public baseFactura: number;
    public descuentoFactura: number;
    public fechaVenta: Date;
    public articulos: DetalleVentaFactura[];
    public id: number;
    public pago: PagoFactura;

    constructor() { }
}
