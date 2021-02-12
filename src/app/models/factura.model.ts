import { Proveedor } from './proveedor.model';
import { DetalleFacturProveedor } from './detalle-factura-proveedor.model';

export class Fatura {

    public proveedor: Proveedor;
    public numero: string;
    public fechaexpedicion: Date;
    public valoriva: number;
    public valortotal: number;
    public fechavencimiento: Date;
    public anotacione: string;
    public articulos: DetalleFacturProveedor[];

    constructor() { }
}
