export type OrderStatus = 'Concluído' | 'Cancelado' | 'Pendente';

export interface Venda {
  readonly id: number;
  readonly cliente: string;
  readonly data: string;
  readonly valor: number;
  readonly status: OrderStatus;
  readonly produto: string;
}

export type SortableColumn = keyof Venda;
export type SortDirection = 'asc' | 'desc';

export interface FilterCriteria {
  readonly cliente: string;
  readonly status: OrderStatus | '';
}

export interface SortConfig {
  readonly column: SortableColumn;
  readonly direction: SortDirection;
}
