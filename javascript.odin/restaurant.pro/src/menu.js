export function loadMenu() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.innerHTML = `
        <h1>Our Menu</h1>
        <p>Pizza - $12</p>
        <p>Pasta - $10</p>
    `;
    content.appendChild(div);
}