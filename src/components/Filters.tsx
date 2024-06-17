import "../css/Filters.css";

const Filters = ({
  filterData,
  updateFilter,
  currentFilter,
  searchText,
}: any) => {
  // an array to define the available filters

  return (
    <div className="filters">
      <div className="filter-title">
        <h3>Filters</h3>
        {currentFilter !== "" ? (
          <i
            className="fa fa-times fil-clear"
            onClick={() => {
              updateFilter("");
            }}
          ></i>
        ) : null}
      </div>
      {/*mapping filter set */}
      {filterData.map((filter: any) => (
        <div
          className={
            currentFilter === filter ? "filter filter-active" : "filter"
          }
          key={filter}
          onClick={() => {
            updateFilter(filter);
            searchText("");
          }}
        >
          {filter}
        </div>
      ))}
    </div>
  );
};

export default Filters;
