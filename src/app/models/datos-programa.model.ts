export class DatosPrograma {
    constructor(
        public id: number,
        public razonSocial: string,
        public nit: string,
        public direccion: string,
        public resolucion: string,
        public fechaResolucion: Date,
        public prefijo: string,
        public inicioNumeracion: number,
        public finNumeracion: number,
        public regimen: string
    ) {

    }
}
