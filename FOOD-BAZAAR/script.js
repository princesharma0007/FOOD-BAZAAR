let restaurants = [];

const restaurantList = document.getElementById("restaurantList");
const searchBox = document.getElementById("searchBox");


fetch("./data/restaurants.json")
    .then((response) => response.json())
    .then((data) => {
        restaurants = data;
        displayRestaurants(restaurants);
        console.log(restaurants);
    })
   
function displayRestaurants(data) {

    restaurantList.innerHTML = "";

    if (data.length === 0) {
        restaurantList.innerHTML = "<h2>No Restaurant Found 😔</h2>";
        return;
    }

    data.forEach((restaurant) => {

        restaurantList.innerHTML += `
        <div class="border rounded-lg shadow p-4 mb-4 flex gap-4">

            <img src="${restaurant.image}"
                class="w-40 h-28 rounded object-cover">

            <div>
                <h2 class="text-xl font-bold">${restaurant.name}</h2>

                <p>${restaurant.category}</p>

                <p>⭐ ${restaurant.rating}</p>

                <p>₹${restaurant.price}</p>

                <p>${restaurant.deliveryTime}</p>

                <p>${restaurant.veg ? "🟢 Veg" : "🔴 Non Veg"}</p>

                <button class="bg-red-600 text-white px-4 py-2 rounded mt-2">
                    Order Now
                </button>

            </div>

        </div>
        `;
    });
}
// search functionality
searchBox.addEventListener("input", function () {

    let searchValue = searchBox.value.toLowerCase();

    let filteredRestaurants = restaurants.filter(function (restaurant) {

        if (
            restaurant.name.toLowerCase().includes(searchValue) ||
            restaurant.category.toLowerCase().includes(searchValue)
        ) {
            return true;
        }

        return false; 
    });

    displayRestaurants(filteredRestaurants);

});
