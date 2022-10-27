function Book(
    title = "Unknown",
    author = "Unknown",
    pages = 0,
    isRead = false
) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

function Library() {
    this.books = [];
}

const libraryPrototype = {
    addBook(book) {
        this.books.push(book);
    },
    removeBook(bookToRemove) {
        this.books = this.books.filter(
            (book) => book.title !== bookToRemove.title
        );
    },
};

const bookPrototype = {
    toggleIsRead() {
        this.isRead = !this.isRead;
    },
};

Object.assign(Book.prototype, bookPrototype);
Object.assign(Library.prototype, libraryPrototype);

const library = new Library();

const container = document.querySelector(".booksContainer");
const addBookButton = document.querySelector(
    ".addBookButton"
);
const addBookModal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModalButton =
    document.querySelector(".closeModal");
const titleInput = document.querySelector(".titleInput");
const authorInput = document.querySelector(".authorInput");
const pagesInput = document.querySelector(".pagesInput");
const readCheckBox = document.querySelector(".checkbox");
const errorMsg = document.querySelector(".errorMessage");

function addBookToLibrary() {
    library.addBook(
        new Book(
            titleInput.value,
            authorInput.value,
            pagesInput.value,
            readCheckBox.checked
        )
    );
}

function titleInputValid() {
    return titleInput.value !== "";
}

function authorInputValid() {
    return authorInput.value !== "";
}

function pagesInputValid() {
    return (
        pagesInput.value !== "" &&
        pagesInput.value < 4999 &&
        pagesInput.value > 0 &&
        !pagesInput.value.includes("e")
    );
}

function isBookInLibrary(title) {
    errorMsg.innerText =
        "That book already exists in the library";
    return library.books.find(
        (book) => book.title === title
    );
}

function throwErrors() {
    if (!titleInputValid()) {
        errorMsg.innerText = "The book must have a title";
    } else if (!authorInputValid()) {
        errorMsg.innerText = "The book must have an author";
    } else if (!pagesInputValid()) {
        if (pagesInput.value === "") {
            errorMsg.innerText = "The book must have pages";
        } else if (pagesInput.value > 5000) {
            errorMsg.innerText =
                "The book must have less than 5000 pages";
        } else if (pagesInput.value < 1) {
            errorMsg.innerText =
                "The book's pages amount must be positive value";
        } else if (pagesInput.value.includes("e")) {
            errorMsg.innerText =
                "The book's pages amount must be in a decimal form";
        }
    }
}

function inputsValid() {
    return (
        authorInputValid() &&
        titleInputValid() &&
        pagesInputValid()
    );
}

function openModal() {
    resetBookForm();
    overlay.classList.add("active");
    addBookModal.classList.add("active");
}

function closeModal() {
    overlay.classList.remove("active");
    addBookModal.classList.remove("active");
    errorMsg.classList.remove("active");
}

function resetBookForm() {
    titleInput.value = "";
    authorInput.value = "";
    pagesInput.value = "";
    readCheckBox.checked = false;
}

function handleKeyboardInput(e) {
    if (e.key === "Escape") closeModal();
}

const createBook = (title, author, pages, isRead) => {
    const book = new Book(title, author, pages, isRead);

    const createBookContainer =
        document.createElement("div");
    const createBookAuthor = document.createElement("p");
    const createBookTitle = document.createElement("p");
    const createBookPages = document.createElement("p");
    const createBookReadButton =
        document.createElement("button");
    const createRemoveBookButton =
        document.createElement("button");

    createBookContainer.classList.add("bookContainer");
    createBookAuthor.classList.add("bookInformation");
    createBookAuthor.classList.add("bookAuthor");
    createBookTitle.classList.add("bookInformation");
    createBookTitle.classList.add("bookTitle");
    createBookPages.classList.add("bookInformation");
    createBookPages.classList.add("bookPages");
    createBookReadButton.classList.add("button");
    createBookReadButton.classList.add(
        "changeIsReadButton"
    );
    createRemoveBookButton.classList.add("button");
    createRemoveBookButton.classList.add(
        "bookRemoveButton"
    );
    createRemoveBookButton.classList.add(
        "bookRemoveButton"
    );

    if (book.isRead) {
        createBookReadButton.classList.add("read");
        createBookReadButton.innerText = "Read";
    } else {
        createBookReadButton.classList.add("notRead");
        createBookReadButton.innerText = "Not read";
    }

    createBookReadButton.addEventListener("click", () => {
        const book = library.books.find(
            (book) =>
                book.title === createBookTitle.innerText
        );
        book.isRead = !book.isRead;
        if (book.isRead) {
            createBookReadButton.classList.remove(
                "notRead"
            );
            createBookReadButton.classList.add("read");
            createBookReadButton.innerText = "Read";
        } else {
            createBookReadButton.classList.remove("read");
            createBookReadButton.classList.add("notRead");
            createBookReadButton.innerText = "Not read";
        }
        saveLocal();
    });

    createRemoveBookButton.addEventListener("click", () => {
        const book = library.books.find(
            (book) =>
                book.title === createBookTitle.innerText
        );
        library.removeBook(book);
        createBookContainer.remove();
        saveLocal();
    });

    container.append(createBookContainer);
    createBookContainer.append(
        createBookAuthor,
        createBookTitle,
        createBookPages,
        createBookReadButton,
        createRemoveBookButton
    );

    createBookAuthor.innerText = `"${book.author}"`;
    createBookTitle.innerText = book.title;
    createBookPages.innerText = `${book.pages} pages`;
    createRemoveBookButton.innerText = "Remove";
};

window.addEventListener("keydown", handleKeyboardInput);

overlay.addEventListener("click", () => {
    closeModal();
});

addBookButton.addEventListener("click", () => {
    openModal();
});

closeModalButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        inputsValid() &&
        !isBookInLibrary(
            e.target.parentNode.childNodes[3].value
        )
    ) {
        addBookToLibrary();
        createBook(
            titleInput.value,
            authorInput.value,
            pagesInput.value,
            readCheckBox.checked
        );
        saveLocal();
        closeModal();
    } else {
        errorMsg.classList.add("active");
        throwErrors();
    }
});

restoreLocal();

// localStorage

function saveLocal() {
    localStorage.setItem(
        "library",
        JSON.stringify(library.books)
    );
}

function restoreLocal() {
    const books = JSON.parse(
        localStorage.getItem("library")
    );
    console.log(books);
    if (books) {
        for (let book of books) {
            console.log(book);
            const newBook = new Book(
                book.title,
                book.author,
                book.pages,
                book.isRead
            );
            library.addBook(newBook);
            createBook(
                book.title,
                book.author,
                book.pages,
                book.isRead
            );
        }
    } else {
        console.log("no books?");
        library.books = [];
    }
}
