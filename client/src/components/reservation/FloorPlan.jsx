function FloorPlan({
  tables = [],
  selectedId,
  onSelect,
  disableReserved = true
}) {
  return (
    <div className="floor-plan">
      <div className="floor-plan__legend">
        <span className="floor-plan__legend-item">
          <span className="floor-plan__legend-swatch" />
          Available
        </span>

        <span className="floor-plan__legend-item">
          <span className="floor-plan__legend-swatch floor-plan__legend-swatch--reserved" />
          Reserved
        </span>

        <span className="floor-plan__legend-item">
          <span className="floor-plan__legend-swatch floor-plan__legend-swatch--selected" />
          Selected
        </span>
      </div>

      <div className="floor-plan__grid-scroll">
        <div className="floor-plan__grid">
          {tables.map((table) => {
            const isReserved =
              String(table.status).toLowerCase() ===
              "reserved";

            const isSelected =
              selectedId === table.id;

            const classes = [
              "floor-plan__table",

              isReserved
                ? "floor-plan__table--reserved"
                : "",

              isSelected
                ? "floor-plan__table--selected"
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={table.id}
                type="button"
                className={classes}
                disabled={
                  disableReserved &&
                  isReserved
                }
                onClick={() =>
                  onSelect?.(table)
                }
                aria-label={`Meja ${table.id}${
                  isReserved
                    ? " (sudah dipesan)"
                    : ""
                }`}
                aria-pressed={isSelected}
              >
                {table.id}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FloorPlan;