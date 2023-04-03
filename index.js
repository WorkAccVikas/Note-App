const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const closeIcon = document.querySelector("header i");
const addBtn = document.querySelector("button");
const titleTag = document.querySelector("input");
const descTag = document.querySelector("textarea");

const popupTitle = popupBox.querySelector("header p");

// getting localStorage notes if exist and parsed them
// to JS Object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false;
let updateId;

addBox.addEventListener("click", () => {
  //   titleTag.focus();
  //   popupBox.classList.add("show");
  popupTitle.innerText = "Add a new Note";
  addBtn.innerText = "Add Note";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
  if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  addBtn.innerText = "Add Note";
  popupTitle.innerText = "Add a new Note";
  popupBox.classList.remove("show");
});

addBtn.addEventListener("click", (e) => {
  console.log(e.target.innerText);
  e.preventDefault();
  let noteTitle = titleTag.value;
  let noteDesc = descTag.value;

  // console.log("button clicked", noteTitle, noteDesc);
  if (noteTitle || noteDesc) {
    // getting month,day,year,from the current date
    let dateObj = new Date();
    let month = dateObj.toLocaleString("default", { month: "long" });
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${month} ${day}, ${year}`,
    };

    if (!isUpdate) {
      notes.push(noteInfo); // adding new note to notes
      localStorage.setItem("notes", JSON.stringify(notes));
      showNotes();
      closeIcon.click();
    } else {
      isUpdate = false;
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
        allowOutsideClick: false,
        position: "top-end",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire({
            title: "Saved",
            text: "",
            icon: "success",
            allowOutsideClick: false,
          }).then((result1) => {
            console.log("here = ", result1);
            if (result1.isConfirmed) {
              console.log("ss", updateId);
              console.log("ss", notes);
              notes[updateId] = noteInfo; // updating specified note
              localStorage.setItem("notes", JSON.stringify(notes));
              showNotes();
              closeIcon.click();
            }
          });
        } else if (result.isDenied) {
          Swal.fire({
            title: "Changes are not saved",
            text: "",
            icon: "info",
            allowOutsideClick: false,
          }).then((result2) => {
            showNotes();
            closeIcon.click();
          });
        }
      });
    }

    // titleTag.value = "";
    // descTag.value = "";
    // popupBox.classList.remove("show");
  }
});

function showNotes() {
  // Remove duplicate note
  document.querySelectorAll(".note").forEach((note) => note.remove());
  console.log("show notes", notes.length);
  notes.forEach((note, index) => {
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span class="description-span">${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick ="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                <li onclick="updateNote(${index},'${note.title}','${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onclick="deleteNote(${index},'${note.title}')"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

showNotes();

function showMenu(element) {
  // console.log(element);
  element.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    // console.log(e.target);
    // console.log(e.target.tagName);
    // removing show class from the settings menu on document click
    if (e.target.tagName != "I" || e.target != element) {
      element.parentElement.classList.remove("show");
    }
  });
}

function deleteNote(noteId, title) {
  console.log(noteId, title);
  Swal.fire({
    title: "Do you want to delete note?",
    text: `Title : ${title}`,
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
    allowOutsideClick: false,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted Successfully",
        text: "",
        icon: "success",
        allowOutsideClick: false,
      }).then((result1) => {
        console.log("here = ", result1);
        if (result1.isConfirmed) {
          notes.splice(noteId, 1); // removing selected note from array/tasks
          localStorage.setItem("notes", JSON.stringify(notes));
          showNotes();
        }
      });
    } else if (result.isDenied) {
      showNotes();
    }
  });
  //   notes.splice(noteId, 1); // removing selected note from array/tasks
  //   localStorage.setItem("notes", JSON.stringify(notes));
  //   showNotes();
}

function updateNote(noteId, title, desc) {
  isUpdate = true;
  updateId = noteId;
  console.log(noteId, title, desc);
  addBox.click();
  titleTag.value = title;
  descTag.value = desc;
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
}
