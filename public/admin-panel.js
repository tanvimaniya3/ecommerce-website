document.getElementById("productForm").addEventListener("submit", async function(e){

e.preventDefault();

let formData = new FormData(this);

let res = await fetch("/api/products",{
method:"POST",
body: formData
});

let data = await res.json();

alert(data.message);

this.reset();

});