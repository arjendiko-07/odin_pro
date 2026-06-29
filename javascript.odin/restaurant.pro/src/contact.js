export function loadContact() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const div = document.createElement('div');
    div.innerHTML = `
        <h1>Contact Us</h1>
        <p>Phone: 123-456-7890</p>
        <p>Email: mario@restaurant.com</p>
    `;
    content.appendChild(div);
}