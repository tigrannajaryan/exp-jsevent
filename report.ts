var table: HTMLElement;

export function log(...data: any[]): void {
    const pre = document.createElement('pre');
    pre.innerText = data.join(" ").toString();
    document.body.append(pre);
}

export function beginTable(title: string, rowHeaders: string[]): void {
    const h1 = document.createElement('h3');
    h1.innerText = title;
    document.body.append(h1);

    table = document.createElement('table');

    var tr = document.createElement('tr');
    for (const cell of rowHeaders) {
        var td = document.createElement('th');
        td.innerText = cell.toString();
        tr.appendChild(td);
    }
    table.appendChild(tr);

    document.body.appendChild(table);
}

export function addRow(row: any[]): void {
    var tr = document.createElement('tr');
    for (const cell of row) {
        var td = document.createElement('td');
        td.innerText = cell.toString();
        tr.appendChild(td);
    }
    table.appendChild(tr);
}