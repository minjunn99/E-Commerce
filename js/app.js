// Variables
const productsDOM = document.querySelector("#productsDOM");
const cartBtn = document.querySelector("#cartBtn");
const cartCloseBtn = document.querySelector("#cartCloseBtn");
const cartRemoveBtn = document.querySelector("#cartRemoveBtn");
const cartDOM = document.querySelector("#cartDOM");
const cartProductsDOM = document.querySelector("#cartProductsDOM");

// Getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map((item) => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;

                return {
                    id,
                    title,
                    price,
                    image,
                };
            });

            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// Display products
class UI {
    displayProducts(products) {
        let result = "";

        products.forEach((product) => {
            result += `
                <!-- product single -->
                <div class="product">
                    <div class="product--img">
                        <img
                            src=${product.image}
                            alt="Images product"
                        />
                    </div>
                    <div class="product--info">
                        <h3 class="product--name">${product.title}</h3>
                        <p class="product--price">${product.price}$</p>
                        <button data-id=${product.id} class="product--cart">
                            Add to cart <ion-icon name="cart"></ion-icon>
                        </button>
                    </div>
                </div>
            `;
        });

        productsDOM.innerHTML = result;
    }
}

// Local Storage
class Storage {}

// DOM Loaded Event
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // Get all products
    products.getProducts().then((products) => ui.displayProducts(products));
});

// Cart Button Event Click
// Open cart
cartBtn.addEventListener("click", () => {
    cartDOM.classList.add("open");
});

// Close cart
cartCloseBtn.addEventListener("click", () => {
    cartDOM.classList.remove("open");
});
