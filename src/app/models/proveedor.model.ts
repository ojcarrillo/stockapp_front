export class Proveedor {
    constructor(
        public nombre: string,
        public nit: string,
        public direccion: string,
        public telefono: string,
        public activo: boolean = false,
        public borrado: boolean = false,
        public id?: number
    ) {

    }
}
