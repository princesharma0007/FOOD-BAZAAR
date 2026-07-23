let restaurants = [];
let restaurantList = document.getElementById("restaurantList");
let searchBox = document.getElementById("searchBox");
let cartBtn = document.getElementById("cart-btn");
let cartList = document.getElementById("cartList");

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Fetch and display restaurants on index.html
if (restaurantList) {
    fetch("./data/restaurants.json")
        .then(response => response.json())
        .then(data => {
            restaurants = data;
            displayRestaurants(restaurants);
        });
}

function displayRestaurants(data) {
    if (!restaurantList) return;

    restaurantList.innerHTML = "";

    if (data.length === 0) {
        restaurantList.innerHTML = "<h2 class='text-2xl font-bold col-span-full text-center mt-10'>No Restaurant Found 😔</h2>";
        return;
    }

    data.forEach((restaurant) => {
        restaurantList.innerHTML += `
        <div class="border rounded-lg shadow p-4 mb-4 flex gap-4 bg-white">
            <img src="${restaurant.image}" class="w-40 h-28 rounded object-cover">
            <div>
                <h2 class="text-xl font-bold">${restaurant.name}</h2>
                <p class="text-gray-600">${restaurant.category}</p>
                <p>⭐ ${restaurant.rating}</p>
                <p class="font-semibold">₹${restaurant.price}</p>
                <p class="text-sm text-gray-500">${restaurant.deliveryTime}</p>
                <p class="font-medium">${restaurant.veg ? "🟢 Veg" : "🔴 Non Veg"}</p>
                <button
                    class="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded mt-2"
                    onclick='addToCart(${JSON.stringify(restaurant)})'>
                    Add to Cart
                </button>
                <button class="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded mt-2">
                    Order Now
                </button>
            </div>
        </div>
        `;
    });
}

// Search Functionality
if (searchBox) {
    searchBox.addEventListener("input", function () {
        let searchValue = searchBox.value.toLowerCase();
        let filteredRestaurants = restaurants.filter(function (restaurant) {
            return (
                restaurant.name.toLowerCase().includes(searchValue) ||
                restaurant.category.toLowerCase().includes(searchValue)
            );
        });
        displayRestaurants(filteredRestaurants);
    });
}

// Add to Cart Logic
function addToCart(restaurant) {
    let existingItem = cartItems.find(item => item.id === restaurant.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        restaurant.quantity = 1;
        cartItems.push(restaurant);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    Swal.fire({
        position: "center",
        icon: "success",
        title: "Item added to cart",
        showConfirmButton: false,
        timer: 1500
    });
}

// Navigate to Cart Page
if (cartBtn) {
    cartBtn.addEventListener("click", function () {
        window.location.href = "cart.html";
    });
}

// Load Cart Items on cart.html
if (cartList) {
    displayCartItems();
}

// Optimized Cart Rendering
function displayCartItems() {
    cartList.innerHTML = "";

    if (cartItems.length === 0) {
        cartList.innerHTML = `
        <h2 class="text-center text-3xl mt-10 font-bold text-gray-700">
            🛒 Your Cart is Empty
        </h2>
        `;
        return;
    }

    let htmlContent = "";

    cartItems.forEach((item, index) => {
        htmlContent += `
        <div class="border rounded-lg shadow p-4 mb-4 flex gap-4 bg-white">
            <img src="${item.image}" class="w-36 h-28 rounded object-cover">
            <div class="flex-1">
                <h2 class="text-xl font-bold">${item.name} <span class="text-sm font-normal text-gray-500">(x${item.quantity})</span></h2>
                <p class="text-gray-600">${item.category}</p>
                <p>⭐ ${item.rating}</p>
                <p class="font-semibold text-lg text-green-700">₹${item.price * item.quantity}</p>
                <button
                    onclick="removeItem(${index})"
                    class="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded mt-2">
                    Remove
                </button>
            </div>
        </div>
        `;
    });

    cartList.innerHTML = htmlContent;
}

// Fixed Remove Item Logic
function removeItem(index) {
    // 1. Array aur LocalStorage update karo
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // 2. Cart ko turant UI par update karo
    displayCartItems();

    // 3. 50ms ka delay dekar SweetAlert chalao taaki DOM clash na ho
    setTimeout(() => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Item removed from cart",
            showConfirmButton: false,
            timer: 1500
        });
    }, 50);
}