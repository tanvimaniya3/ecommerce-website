// 🔁 PAGE LOAD CHECK
window.onload = function(){

if(localStorage.getItem("adminLogin") === "true"){
showDashboard();
}

};


// 🔐 LOGIN
function login(){

let user = document.getElementById("username").value.trim();
let pass = document.getElementById("password").value.trim();

if(user === "admin" && pass === "1234"){

localStorage.setItem("adminLogin","true");

showDashboard();

}else{

document.getElementById("error").innerText = "Wrong Username or Password ❌";

}

}


// 🔓 LOGOUT
function logout(){

localStorage.removeItem("adminLogin");
location.reload();

}


// 📊 SHOW DASHBOARD
function showDashboard(){

document.getElementById("loginBox").style.display = "none";
document.getElementById("dashboard").style.display = "block";

loadOrders();

}


// 📦 LOAD ORDERS
async function loadOrders(){

let res = await fetch("https://ecommerce-website-1-psvr.onrender.com/api/orders");
let orders = await res.json();

let box = document.getElementById("ordersBox");
box.innerHTML = "";

orders.reverse().forEach(o => {

box.innerHTML += `
<div class="order">
<h3>👤 ${o.name}</h3>
<p>📞 ${o.phone}</p>
<p>📦 Status: ${o.status}</p>
</div>
`;

});

}
