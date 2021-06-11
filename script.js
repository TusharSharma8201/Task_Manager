let allFilters = document.querySelectorAll(".filter div");
let grid = document.querySelector(".grid");
let addbtn = document.querySelector(".add");
let body = document.querySelector("body");
let info = document.querySelector(".info-btn");
let recyclebin=document.querySelector(".recycle-bin");
let uid = new ShortUniqueId();
let modalvisible = false;
let deletestate = false;
let blurstate=false;
let colorclasses = ["pink", "blue", "green", "black"]
let heading=document.querySelector("h1");
heading.addEventListener("click",function(){
  location.reload();
})

let colors = {
  pink: "#d595aa",
  blue: "#5ecdde",
  green: "#91e6c7",
  black: "black",
};
let x = document.getElementById("infoid");

x.style.display = "none"
info.addEventListener("click", function (e) {
  
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
})

if (!localStorage.getItem("task")) {
  localStorage.setItem("task", JSON.stringify([]))
}
if (!localStorage.getItem("deleteditem")) {
  localStorage.setItem("deleteditem", JSON.stringify([]))
}
let deletebtn = document.querySelector(".delete")
deletebtn.addEventListener("click", function (e) {
  if (deletestate) {
    deletestate = false;
    e.currentTarget.classList.remove("delete-state")
  }
  else {
    deletestate = true;
    e.currentTarget.classList.add("delete-state")
  }
})
addbtn.addEventListener("click", function () {
  if (modalvisible) return;

  let modal = document.createElement("div");
  modal.classList.add("modal-container");
  modal.setAttribute("click-first", true)
  
  grid.classList.add("blur");
  modal.innerHTML = `  <div class="writing-area" contenteditable>Enter Your Task!!</div>
      <div class="filter-area">
        <div class="modal-filter pink"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter blue"></div>
        <div class="modal-filter black active-modal-filter"></div>
      </div>`;

  let allmodalfilter = modal.querySelectorAll(".modal-filter")
  for (let i = 0; i < allmodalfilter.length; i++) {
    allmodalfilter[i].addEventListener("click", function (e) {
      for (let j = 0; j < allmodalfilter.length; j++) {
        allmodalfilter[j].classList.remove("active-modal-filter");
      }
      e.currentTarget.classList.add("active-modal-filter");
    });
  }
 
  let wa = modal.querySelector(".writing-area");
  wa.addEventListener("click", function (e) {
    if (modal.getAttribute("click-first") == "true") {
      wa.innerHTML = "";
      modal.setAttribute("click-first", false);
    }
  });

  wa.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      grid.classList.remove("blur")
      let task = e.currentTarget.innerText;
      let selectedmodalfilter = document.querySelector(".active-modal-filter");
      let color = selectedmodalfilter.classList[1];
      let id = uid();
      let date = new Date().toDateString();

      let ticket = document.createElement("div");
      ticket.classList.add("ticket")
      ticket.innerHTML = `  <div class="ticket-color ${color}"></div>
      <div class="ticket-id">#${id}</div>
      <div class="date-time">${date}</div>
      <div class="ticket-box " contenteditable>
      ${task}
      </div>
      </div>`;
      saveTicketinLocalStorage(id, color, task, date);

      ticketWritingArea = ticket.querySelector(".ticket-box");
      ticketWritingArea.addEventListener("input", ticketWritingAreaHandler)

      ticket.addEventListener("click", function (e) {
        if (deletestate) {
        let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
        let taskarr = JSON.parse(localStorage.getItem("task"));
       taskarr=taskarr.filter(function(el){
         return el.id!=id;
        
       });
       localStorage.setItem("task", JSON.stringify(taskarr));
       deletedtickets(id, color, task, date);
          e.currentTarget.remove();
        }
      })
      let ticketcolorDiv = ticket.querySelector(".ticket-color");
      ticketcolorDiv.addEventListener("click", ticketcolorHandler)

      grid.appendChild(ticket);
      modal.remove();
      modalvisible = false;

    }
  });
  body.appendChild(modal);
  modalvisible = true;

});




for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    if (e.currentTarget.parentElement.classList.contains("selected-filter")) {
      e.currentTarget.parentElement.classList.remove("selected-filter");
      loadtask();
    } else {
      let color = e.currentTarget.classList[0].split("-")[0];
      e.currentTarget.parentElement.classList.add("selected-filter");
      
      loadtask(color);
    }
   
  });
}
//=======saving ticket in local storage===========////////////////
function saveTicketinLocalStorage(id, color, task, date) {
  let reqobj = { id, color, task, date };
  let taskarr = JSON.parse(localStorage.getItem("task"));
  taskarr.push(reqobj);
  localStorage.setItem("task", JSON.stringify(taskarr));

}
//========================/////////////////////////===========
function deletedtickets(id, color, task, date) {
  let reqobj = { id, color, task, date };
  let taskarr = JSON.parse(localStorage.getItem("deleteditem"));
  taskarr.push(reqobj);
  localStorage.setItem("deleteditem", JSON.stringify(taskarr));

}

//==========https://an-2000.github.io/Josh-Todo-Assignment/  ================//




function ticketcolorHandler(e) {

  let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
  let taskarr = JSON.parse(localStorage.getItem("task"));
  let reqIndex = -1;
  for (let i = 0; i < taskarr.length; i++) {
    if (taskarr[i].id == id) {
      reqIndex = i;
    }
  }

  let currcolor = e.currentTarget.classList[1];
  let index = colorclasses.indexOf(currcolor);
  index++;
  index = index % 4;
  e.currentTarget.classList.remove(currcolor);
  e.currentTarget.classList.add(colorclasses[index]);
  taskarr[reqIndex].color = colorclasses[index];
  localStorage.setItem("task", JSON.stringify(taskarr));
}

function ticketWritingAreaHandler(e) {
  let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
  let taskarr = JSON.parse(localStorage.getItem("task"));
  let reqIndex = -1;
  for (let i = 0; i < taskarr.length; i++) {
    if (taskarr[i].id == id) {
      reqIndex = i;
    }
  }
  taskarr[reqIndex].task = e.currentTarget.innerText;
  localStorage.setItem("task", JSON.stringify(taskarr));

}

function loadtask(passedColor){
  //=====if any ticket exist on UI delete all============////
  let allTickets=document.querySelectorAll(".ticket");
  for(let t=0;t<allTickets.length;t++){
    allTickets[t].remove();
  }

  let taskarr = JSON.parse(localStorage.getItem("task"));
  for(let i=0;i<taskarr.length;i++){
    let id=taskarr[i].id;
    let color=taskarr[i].color;
    let taskvalue=taskarr[i].task;
    let date=taskarr[i].date;

    if(passedColor){
      if(passedColor!=color) continue;
    }
    let ticket = document.createElement("div");
      ticket.classList.add("ticket")
      ticket.innerHTML = `  <div class="ticket-color ${color}"></div>
      <div class="ticket-id">#${id}</div>
      <div class="date-time">${date}</div>
      <div class="ticket-box " contenteditable>
      ${taskvalue}
      </div>
      </div>`;
      ticketWritingArea = ticket.querySelector(".ticket-box");
      ticketWritingArea.addEventListener("input", ticketWritingAreaHandler)

      let ticketcolorDiv = ticket.querySelector(".ticket-color");
      ticketcolorDiv.addEventListener("click", ticketcolorHandler)
      ticket.addEventListener("click", function (e) {
        if (deletestate) {
        let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
        let taskarr = JSON.parse(localStorage.getItem("task"));
       taskarr=taskarr.filter(function(el){
         return el.id!=id;
        
       });
       localStorage.setItem("task", JSON.stringify(taskarr));
       
          e.currentTarget.remove();
        }
      });
      grid.appendChild(ticket);


  }
}
loadtask();

//===================================//
recyclebin.addEventListener("click",function(e){
  
  let allTickets=document.querySelectorAll(".ticket");
  for(let t=0;t<allTickets.length;t++){
    allTickets[t].remove();
  }
    let deleteditem = JSON.parse(localStorage.getItem("deleteditem"));
    for(let i=0;i<deleteditem.length;i++)
    {

      let id=deleteditem[i].id;
      let color=deleteditem[i].color;
      let taskvalue=deleteditem[i].task;
      let date=deleteditem[i].date;
      let ticket = document.createElement("div");
      ticket.classList.add("ticket")
      ticket.innerHTML = `  <div class="ticket-color ${color}"></div>
      <div class="ticket-id">#${id}</div>
      <div class="date-time">${date}</div>
      <div class="ticket-box " contenteditable>
      ${taskvalue}
      </div>
      </div>`;

      grid.appendChild(ticket);
    }
    // location.reload();// to reload
  
});

