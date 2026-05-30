const libCon = [];

function Book(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
};

function addBook(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    libCon.push(newBook);
    renderLibrary();
}

function renderLibrary() {
    const container = document.getElementById("bookContainer");

    container.innerHTML = "";

    libCon.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p><strong>Status:</strong> ${book.read ? "Read" : "Not Read"}</p>

            <button class="toggleBtn">Change Read</button>
            <button class="removeBtn">Remove</button>
        `;

        card.querySelector(".toggleBtn").addEventListener("click", () => {
            book.toggleRead();
            renderLibrary();
        });

        card.querySelector(".removeBtn").addEventListener("click", () => {
            const index = libCon.findIndex(b => b.id === book.id);
            libCon.splice(index, 1);
            renderLibrary();
        });

        container.appendChild(card);
    });
}

const dialog = document.getElementById("bookDialog");
const form = document.getElementById("bookForm");
const newBookBtn = document.getElementById("newBookBtn");
const closeDialog = document.getElementById("closeDialog");

newBookBtn.addEventListener("click", () => {
    dialog.showModal();
});

closeDialog.addEventListener("click", () => {
    dialog.close();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = Number(document.getElementById("pages").value);
    const read = document.getElementById("read").checked;

    addBook(title, author, pages, read);

    form.reset();
    dialog.close();
});

addBook("Origin", "Dan Brown", 400, true);
addBook("Harry Potter", "J.K. Rowling", 600, false);