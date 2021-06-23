import { Proveedor } from './proveedor.model';
import { DetalleFacturProveedor } from './detalle-factura-proveedor.model';
import { formatDate } from '../shared/app-settings.module';

export class Factura {

    public proveedor: Proveedor;
    public numeroFactura: string;
    public fechaExpedicion: Date;
    public valorIva: number;
    public valorFactura: number;
    public fechaVencimiento: Date;
    public anotaciones: string;
    public articulos: DetalleFacturProveedor[];
    public id: number;
    public estado: string;

    constructor() { }

}
