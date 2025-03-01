export interface PlanIntervencion {
    id: number;
    nombre: string;
    descripcion: string;
    linea_id: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface ApiResponse {
    success: boolean;
    planes: PlanIntervencion[];
  }
  