export function loadHome() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.innerHTML = `
        <h1>Welcome to Mario's</h1>
        <p>The best Italian food in town!</p>
    `;
    content.appendChild(div);
}