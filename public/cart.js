let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadCart(){

let box = document.getElementById("cartItems");
let totalBox = document.getElementById("totalPrice");

box.innerHTML = "";

let total = 0;

cart.forEach((p, index) => {

total += p.price * p.qty;

box.innerHTML += `
<div class="cart-item">

<h3>${p.name}</h3>
<p>₹${p.price}</p>

<div style="display:flex; align-items:center; gap:10px;">

<button onclick="decreaseQty(${index})">➖</button>

<span>${p.qty}</span>

<button onclick="increaseQty(${index})">➕</button>

<button onclick="removeItem(${index})" style="margin-left:20px; color:red;">❌ Remove</button>

</div>

</div>
<hr>
`;

});

totalBox.innerText = "Total: ₹" + total;

}


// ➕ increase
function increaseQty(index){
cart[index].qty += 1;
saveCart();
}

// ➖ decrease
function decreaseQty(index){
if(cart[index].qty > 1){
cart[index].qty -= 1;
}
saveCart();
}

// ❌ remove
function removeItem(index){
cart.splice(index,1);
saveCart();
}

// 💾 save
function saveCart(){
localStorage.setItem("cart", JSON.stringify(cart));
loadCart();
}

// पहली बार load
loadCart();