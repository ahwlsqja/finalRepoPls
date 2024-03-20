
// column.interface.ts
export interface Column {
    columnsId: number;
    boardId: number;
    title: string;
    color: 'black' | 'white' | 'blue' | 'red' | 'yellow';
    orderByColumns: number;
    createdAt: string;
    updatedAt: string;
}
