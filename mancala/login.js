var users = [];

function login(event) {
    
    event.preventDefault();

    const parent = document.getElementById("logdiv");
    const nav = document.getElementById("nav");

    const name = document.querySelector("#userName").value;
    const password = document.querySelector("#password").value;
    users.push({"userName": name, "password": password});

    parent.style.display = 'none';
    const e = document.createElement("p");
    e.innerText = "Player: "+ name;
    nav.appendChild(e);

}