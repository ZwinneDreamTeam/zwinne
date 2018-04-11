export function customSort(a, b, sortBy, sortingOrder) {
  //handle nulls
  if (sortingOrder === 'asc') {
    if (!a[sortBy]) return -1;
    else if (!b[sortBy]) return 1;
  } else {
    if (!a[sortBy]) return 1;
    else if (!b[sortBy]) return -1;
  }

  if (typeof(a[sortBy]) === "boolean") {
    return compareBooleans(a, b, sortBy, sortingOrder);
  } else {
    return compareStrings(a, b, sortBy, sortingOrder);
  }
}

function compareBooleans(a, b, sortBy, sortingOrder) {
  if (a[sortBy] === b[sortBy])
    return 0;
  else if (a[sortBy] && !b[sortBy]) {
    return sortingOrder === 'desc' ? 1 : -1;
  } else {
    return sortingOrder === 'desc' ? -1 : 1;
  }

}
function compareStrings(a, b, sortBy, sortingOrder) {
  if (sortingOrder === 'desc') {
    return a[sortBy].localeCompare(b[sortBy])
  } else {
    return b[sortBy].localeCompare(a[sortBy])
  }
}
