function Table({
  columns = [],
  data = [],
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  onRowClick,
  renderActions,
  actionsAlign = "left",
  emptyState,
  getRowId = (row) => row.id,
}) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  if (data.length === 0 && emptyState) {
    return <div className="table-wrapper">{emptyState}</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {selectable && (
              <th className="table__checkbox-cell">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  aria-label="Pilih semua baris"
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width, textAlign: col.align || "left" }}>
                {col.header}
              </th>
            ))}
            {renderActions && (
              <th className={actionsAlign === "center" ? "table__actions-header--center" : undefined}>
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowId = getRowId(row);
            const isSelected = selectedIds.includes(rowId);

            return (
              <tr
                key={rowId}
                className={isSelected ? "table__row--selected" : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: "pointer" } : undefined}
              >
                {selectable && (
                  <td className="table__checkbox-cell" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectRow?.(rowId)}
                      aria-label={`Pilih baris ${rowId}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || "left" }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {renderActions && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <div
                      className={`table__actions-cell${
                        actionsAlign === "center" ? " table__actions-cell--center" : ""
                      }`}
                    >
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;