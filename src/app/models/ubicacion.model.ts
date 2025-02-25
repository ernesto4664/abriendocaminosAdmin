export interface Comuna {
    id: number;
    nombre: string;
    ccomuna: string;
    region_id: number;
    provincia_id: number;
  }
  
  export interface Provincia {
    id: number;
    nombre: string;
    codprovincia: number;
    region_id: number;
    comunas?: Comuna[]; // Relación con comunas (opcional)
  }
  
  export interface Region {
    id: number;
    nombre: string;
    created_at?: string | null;
    updated_at?: string | null;
    provincias?: Provincia[]; // Relación con provincias (opcional)
  }
  