function login(){

let user = document.getElementById("username").value;
let pass = document.getElementById("password").value;

// 🔐 correct login
if(user === "admin" && pass === "1234"){

// ✅ IMPORTANT FIX (same key everywhere)
localStorage.setItem("adminLogin","true");

// redirect (dashboard)
window.location.href = "admin.html";

}else{

// ❌ error show
document.getElementById("error").innerText = "Wrong Username or Password ❌";

}

}
