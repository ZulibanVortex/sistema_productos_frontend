export interface productTable {
    id: number;
    nombre: string;
    precio: string;
    cantidad: number;
    observaciones: string;
    imagen?: string;
}

export interface productSave {
    nombre: string;
    precio: string;
    cantidad: number;
    observaciones: string;
    imagen?: string;
}