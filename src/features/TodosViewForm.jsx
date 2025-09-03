function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>
        Sort by:
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
      </label>

      <label>
        Direction:
        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>

      <label>
        Search todos:
        <input
          type="text"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setQueryString('')}>
          Clear
        </button>
      </label>
    </form>
  );
}

export default TodosViewForm;
