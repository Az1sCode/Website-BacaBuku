// import {findId, findIndexId, cekDataIsExist, cekStorage, cekLocalStorage, saveData} from './checkScript.js';

const books = [];
const displayEvent = "EVENT_DISPLAY";
const bookStorageKey = "LIST_BOOKS";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  cekLocalStorage();
});

const addBook = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const parseToNumber = parseInt(year);
  const isComplete = document.getElementById("isComplete").checked;

  const id = createId();
  const noteBook = generateBook(id, title, author, parseToNumber, isComplete);
  books.push(noteBook);

  document.dispatchEvent(new Event(displayEvent));
  saveData();
};

const createId = () => {
  return +new Date();
};

const generateBook = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

document.addEventListener(displayEvent, () => {
  const title = document.getElementById("title");
  title.value = "";

  const author = document.getElementById("author");
  author.value = "";

  const year = document.getElementById("year");
  year.value = "";

  const isComplete = document.getElementById("isComplete");
  isComplete.checked = false;

  const unReadBooks = document.getElementById("unRead-books");
  unReadBooks.innerHTML = "";

  const readBooks = document.getElementById("read-books");
  readBooks.innerHTML = "";

  for (let booksItem of books) {
    const booksElement = createBooks(booksItem);
    if (!booksItem.isComplete) {
      unReadBooks.append(booksElement);
    } else {
      readBooks.append(booksElement);
    }
  }
});

const createBooks = (booksItem) => {
  const authorBooks = document.createElement("p");
  authorBooks.innerText = booksItem.author;

  const yearBook = document.createElement("p");
  yearBook.innerText = booksItem.year;

  const detailInfo = document.createElement("div");
  detailInfo.classList.add("books-detail");
  detailInfo.append(authorBooks, yearBook);

  const titleBooks = document.createElement("h3");
  titleBooks.innerText = booksItem.title;

  const booksInfo = document.createElement("div");
  booksInfo.classList.add("books-information");
  booksInfo.append(titleBooks, detailInfo);

  const listItem = document.createElement("div");
  listItem.classList.add("list-item");
  listItem.setAttribute("id", `books-Id ${booksItem.id}`);

  if (!booksItem.isComplete) {
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btn-edit");
    btnEdit.addEventListener("click", () => {
      // editBook(booksItem.id);
    });

    const btnUncomplete = document.createElement("button");
    btnUncomplete.classList.add("btn-uncomplete");
    btnUncomplete.addEventListener("click", () => {
      finishedRead(booksItem.id);
      saveData();
    });

    const btnTrash = document.createElement("button");
    btnTrash.classList.add("btn-trash");
    btnTrash.addEventListener("click", () => {
      removeDialog(booksItem);
      saveData();
    });

    listItem.append(booksInfo, btnEdit, btnUncomplete, btnTrash);
  } else {
    const btnCompleted = document.createElement("button");
    btnCompleted.classList.add("btn-completed");
    btnCompleted.addEventListener("click", () => {
      unfinishedRead(booksItem.id);
      saveData();
    });

    const btnTrash = document.createElement("button");
    btnTrash.classList.add("btn-trash");
    btnTrash.addEventListener("click", () => {
      removeDialog(booksItem);
      saveData();
    });

    listItem.append(booksInfo, btnCompleted, btnTrash);
  }

  const finishedRead = (booksId) => {
    const findBooks = findId(booksId);

    if (findBooks === null) return;

    console.log(findBooks);

    findBooks.isComplete = true;
    document.dispatchEvent(new Event(displayEvent));
  };

  const unfinishedRead = (booksId) => {
    const findBooks = findId(booksId);

    if (findBooks === null) return;

    findBooks.isComplete = false;
    document.dispatchEvent(new Event(displayEvent));
  };

  const removeBook = (booksId) => {
    const booksIndex = findIndexId(booksId);

    if (booksIndex === null) return;

    books.splice(booksIndex, 1);
    document.dispatchEvent(new Event(displayEvent));
  };

  const removeDialog = (booksItem) => {
    const questConfirm = confirm(
      `Apakah kamu mau menghapus ${booksItem.title}`
    );
    if (questConfirm !== false) {
      removeBook(booksItem.id);
    } else {
      event.preventDefault;
    }
  };

  const editBook = (booksId) => {
    const findBook = findId(booksId);

    const title = document.getElementById("title");
    title.value = findBook.title;

    const author = document.getElementById("author");
    author.value = findBook.author;

    const year = document.getElementById("year");
    year.value = findBook.year;

    const isComplete = document.getElementById("isComplete");
    isComplete.checked = findBook.isComplete;

    document.querySelector(".btn-submit").setAttribute("hidden", true);

    const btnEdit = document.querySelector(".btn-editData");
    btnEdit.removeAttribute("hidden");
    btnEdit.addEventListener("click", () => {
      for (let book of books) {
        if (book.id === findBook.id) {
          findBook.title = title.value;
          findBook.author = author.value;
          findBook.year = year.value;
          findBook.isComplete = isComplete.checked;
        }
      }
    });
  };

  return listItem;
};

const findIndexId = (booksId) => {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === booksId) {
      return i;
    }
  }
  return null;
};

const findId = (booksId) => {
  for (let book of books) {
    if (book.id === booksId) {
      console.log(book);
      return book;
    }
  }
  return null;
};

const cekDataIsExist = (booksId) => {
  for (let book of books) {
    if (booksId === book.id) {
      return true;
    }
  }
  return false;
};

const cekStorage = () => {
  if (typeof Storage === "undefined") {
    alert("Browser tidak mendukung local storage");
  }
  return true;
};

const saveData = () => {
  if (cekStorage()) {
    const bookJson = JSON.stringify(books);
    localStorage.setItem(bookStorageKey, bookJson);
    document.dispatchEvent(new Event(displayEvent));
  }
};

const cekLocalStorage = () => {
  if (cekStorage()) {
    const data = localStorage.getItem(bookStorageKey);
    const booksObject = JSON.parse(data);

    if (booksObject !== null) {
      for (const book of booksObject) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(displayEvent));
  }
};
