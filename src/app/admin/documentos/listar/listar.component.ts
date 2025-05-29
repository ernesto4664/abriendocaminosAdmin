// src/app/admin/documentos/listar-documentos/listar-documentos.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DocumentoFormularioService, Documento } from '../../../services/documento-formulario.service';
import { saveAs } from 'file-saver';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-listar-documentos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule  // <-- aquí
  ],
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarDocumentosComponent implements OnInit {
  private docService = inject(DocumentoFormularioService);
  private router     = inject(Router);              // <-- y aquí

  documentos: Documento[] = [];
  activeMenuId: number | null = null;

  currentPage = 1;
  pageSize   = 10;
  get totalPages() { return Math.ceil(this.documentos.length / this.pageSize); }
  get paged(): Documento[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.documentos.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    this.docService.listar().subscribe(list => this.documentos = list);
  }

  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  editarDocumento(id: number) {
    // ahora this.router sí existe
    this.router.navigate(['/admin/documentos/editar', id]);
  }

  eliminarDocumento(id: number) {
    if (!confirm('¿Eliminar este documento?')) return;
    this.docService.eliminar(id).subscribe(() => {
      this.documentos = this.documentos.filter(d => d.id !== id);
    });
  }

  descargarDocumento(d: Documento) {
    this.docService.descargar(d.id).subscribe(blob => {
      const ext = d.ruta_archivo.split('.').pop();
      saveAs(blob, `${d.nombre}.${ext}`);
    });
  }

  irAPagina(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.currentPage = n;
  }
}
