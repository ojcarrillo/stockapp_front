export class Iva {
    constructor(
        public nombre: string,
        public porcentaje: number,
        public activo: boolean,
        public borrado: boolean,
        public id?: number
    ) {

    }
}
