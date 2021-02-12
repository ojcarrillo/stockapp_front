export class Usuario {
    constructor(
        public nombre: string,
        public documento: number,
        public login: string,
        public activo: boolean,
        public celular?: string,
        public telefono?: string,
        public password?: string,
        public id?: number
    ) {

    }
}
