function login(){

let user = document.getElementById("username").value;
let pass = document.getElementById("password").value;

if(user === "admin" && pass === "1234"){

localStorage.setItem("admin","true");

alert("Login Success");

// 👉 अब product panel open होगा
window.location.href = "admin-panel.html";

}else{

alert("Wrong Username or Password");

}

}