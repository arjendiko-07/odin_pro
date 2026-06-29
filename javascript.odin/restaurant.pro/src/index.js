import { loadHome } from './home.js';
import { loadMenu } from './menu.js';
import { loadContact } from './contact.js';

// Load home page by default
loadHome();

// Tab switching
document.getElementById('home-btn').addEventListener('click', loadHome);
document.getElementById('menu-btn').addEventListener('click', loadMenu);
document.getElementById('contact-btn').addEventListener('click', loadContact);