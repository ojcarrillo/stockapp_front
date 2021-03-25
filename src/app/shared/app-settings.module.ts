import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

export class AppSettings {

    public static CONFIRM_OPS = {
        title: '¿Está ud seguro?',
        text: '¡Ésta acción no se puede revertir!',
        icon: 'question',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        showClass: {
            popup: 'fadeIn'
        },
        hideClass: {
            popup: 'fadeOut'
        }
    };

    public static MANTENIMIENTO_ROUTES = [
        { parent: 'Mantenimiento', titulo: 'Tipo de Artículo', link: '/mantenimiento/tipo-articulo' },
        { parent: 'Mantenimiento', titulo: 'IVA', link: '/mantenimiento/iva' },
        { parent: 'Mantenimiento', titulo: 'Presentación', link: '/mantenimiento/presentacion' },
        { parent: 'Mantenimiento', titulo: 'Unidad', link: '/mantenimiento/unidad' },
        { parent: 'Mantenimiento', titulo: 'Proveedor', link: '/mantenimiento/proveedor' },
        { parent: 'Mantenimiento', titulo: 'Artículo', link: '/mantenimiento/articulo' },
        { parent: 'Mantenimiento', titulo: 'Usuario', link: '/mantenimiento/usuario' },
        { parent: 'Mantenimiento', titulo: 'Datos del Programa', link: '/mantenimiento/datos-programa' }
    ];

    public static SWAL_GUARDADO = {
        text: '¡El registro ha sido almacenado!',
        icon: 'success',
        showClass: {
            popup: ''
        },
        hideClass: {
            popup: ''
        }
    };

    public static SWAL_ELIMINADO = {
        text: '¡El registro ha sido eliminado!',
        icon: 'success',
        showClass: {
            popup: ''
        },
        hideClass: {
            popup: ''
        }
    };

    public static SWAL_REDIRECT = {
        text: '¡El tiempo de inactividad superado!, ha sido redireccionado para volver a ingresar',
        icon: 'warning',
        showClass: {
            popup: ''
        },
        hideClass: {
            popup: ''
        }
    };

    public static SWAL_WARNING = {
        text: '',
        icon: 'warning',
        showClass: {
            popup: ''
        },
        hideClass: {
            popup: ''
        }
    };

}

export const URL_SERVICIOS = 'http://localhost:9001';

export const URL_UPLOAD_FILE = URL_SERVICIOS + '/uploadFileJSON';

export function formatMoney(value: any) {
    const temp = `${value}`.replace(/\,/g, '');
    return this.currencyPipe.transform(temp).replace('$', '');
}

export function transformCurrency(event: any, control: any) {
    const value = event.value;
    control.setValue(
        this.formatMoney(value.replace(/\,/g, '')),
        { emitEvent: false }
    );
}

export function formatDate(fecha: any, formato: string) {
    const datepipe: DatePipe = new DatePipe('en-US');
    const formattedDate = datepipe.transform(fecha, formato);
    return formattedDate;
}
