import { cloneElement } from 'react';
export async function exportToXlsx(gridElement, fileName) {
  const [{ utils, writeFile }, { head, body, foot }] = await Promise.all([
    import('xlsx'),
    getGridContent(gridElement),
  ]);
  const wb = utils.book_new();
  const ws = utils.aoa_to_sheet([...head, ...body, ...foot]);
  utils.book_append_sheet(wb, ws, 'Sheet 1');
  writeFile(wb, fileName);
}

async function getGridContent(gridElement) {
  const { renderToStaticMarkup } = await import('react-dom/server');
  const grid = document.createElement('div');
  grid.innerHTML = renderToStaticMarkup(
    cloneElement(gridElement, {
      enableVirtualization: false,
    })
  );

  return {
    head: getRows('.rdg-header-row'),
    body: getRows('.rdg-row:not(.rdg-summary-row)'),
    foot: getRows('.rdg-summary-row'),
  };

  function getRows(selector) {
    return Array.from(grid.querySelectorAll(selector)).map((gridRow) => {
      return Array.from(gridRow.querySelectorAll('.rdg-cell')).map(
        (gridCell) => gridCell.innerText
      );
    });
  }
}
