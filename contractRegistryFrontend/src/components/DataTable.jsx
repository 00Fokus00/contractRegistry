import React from 'react';

export default function DataTable({
  columns,
  rows,
  sortField,
  sortOrder,
  onSortChange,
  getRowKey,
  actions,
  emptyMessage = 'Записи не найдены',
}) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortField === col.key;
              return (
                <th
                  key={col.key}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={() => col.sortable && onSortChange && onSortChange(col.key)}
                  title={col.sortable ? 'Нажмите, чтобы отсортировать' : undefined}
                >
                  {col.label}
                  {isSorted ? (sortOrder === 'desc' ? ' ▼' : ' ▲') : ''}
                </th>
              );
            })}
            {actions && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="empty-state">
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {actions && <td className="row-actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
