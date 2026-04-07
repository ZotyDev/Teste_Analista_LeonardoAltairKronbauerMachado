import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Venda } from '../../models/venda.model';

@Component({
  selector: 'app-export-csv',
  standalone: true,
  imports: [],
  templateUrl: './export-csv.component.html',
  styleUrl: './export-csv.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportCsvComponent {
  readonly data = input.required<readonly Venda[]>();
  readonly isFiltered = input<boolean>(false);

  export(): void {
    const vendas = this.data();
    if (vendas.length === 0) return;

    const headers = ['ID', 'Data', 'Cliente', 'Produto', 'Valor', 'Status'];
    const rows = vendas.map(v => [
      v.id,
      v.data,
      `"${v.cliente}"`,
      `"${v.produto}"`,
      v.valor.toFixed(2),
      v.status,
    ]);

    // Separador ";" para compatibilidade com Excel BR; BOM (\ufeff) para encoding UTF-8
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `vendas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }
}
