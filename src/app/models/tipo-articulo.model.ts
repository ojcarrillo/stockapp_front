export class TipoArticulo {
    constructor(
        public nombre: string,
        public activo: boolean,
        public borrado: boolean,
        public id?: number
    ) {

    }
}
