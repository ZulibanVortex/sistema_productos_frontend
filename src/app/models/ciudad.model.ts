export interface cityTable {
    id: number;
    id_product: number;
    id_city: number;
    nombre: string;
    latitud: number;
    longitud: number
}

export interface citiesTable {
    id: number,
    nombre: string,
    latitud: number,
    longitud: number
}

export interface citySave {
    id_product: number;
    id_city: number;
}