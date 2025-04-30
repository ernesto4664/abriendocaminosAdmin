import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detalle-section',
  standalone: true,
  templateUrl: './registro-detalle.component.html',
    imports: [ MatButtonModule, MatIconModule],
  styleUrls: ['./registro-detalle.component.scss']
})
export class DetalleSectionComponent {
  @Input() title!: string;
  @Input() leftItems: { label: string; value: string }[] = [];
  @Input() rightItems: { label: string; value: string }[] = [];
  @Input() editLabel = 'Editar';
  @Input() documentLabel = 'Documento adjunto';
}
