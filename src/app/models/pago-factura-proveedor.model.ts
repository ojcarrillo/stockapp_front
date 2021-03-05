import { Factura } from './factura.model';

export class PagoFacturaProveedor {


    public factura: Factura;
    public fechaPago: Date;
    public metodoPago: string;
    public valorPago: number;
    public cheque: string;
    public banco: string;
    public descuento: number;
    public id: number;

    constructor() { }
}
