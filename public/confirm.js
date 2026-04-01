let order = JSON.parse(localStorage.getItem("lastOrder"));

if(!order){
document.body.innerHTML = "<h2>No Order Found ❌</h2>";
}

// 🆔 Order ID generate
let orderId = "ORD" + Math.floor(Math.random() * 1000000);

let idBox = document.getElementById("orderId");
if(idBox){
idBox.innerText = "Order ID: " + orderId;
}

// 📦 DETAILS
let nameBox = document.getElementById("cName");
let phoneBox = document.getElementById("cPhone");
let addressBox = document.getElementById("cAddress");

if(nameBox) nameBox.innerText = "Name: " + order.name;
if(phoneBox) phoneBox.innerText = "Phone: " + order.phone;
if(addressBox) addressBox.innerText =
"Address: " + order.address + ", " + order.state + " - " + order.pincode;


// 🛒 ITEMS
let box = document.getElementById("orderItems");
let totalBox = document.getElementById("totalAmount");

let total = 0;

if(box){

box.innerHTML = "";

order.items.forEach(p => {

total += p.price * p.qty;

box.innerHTML += `
<div style="margin:10px 0; display:flex; gap:10px; align-items:center;">

<img src="https://ecommerce-website-1-psvr.onrender.com${p.image}" width="80">

<div>
<h4>${p.name}</h4>
<p>₹${p.price} x ${p.qty}</p>
</div>

</div>
<hr>
`;

});

}

// 💰 TOTAL (अगर backend से आया है तो वही use करो)
if(totalBox){
if(order.total){
totalBox.innerText = "Total Paid: ₹" + order.total;
}else{
totalBox.innerText = "Total Paid: ₹" + total;
}
}
