// Variables
const productsDOM = document.querySelector("#productsDOM");
const cartBtn = document.querySelector("#cartBtn");
const cartCloseBtn = document.querySelector("#cartCloseBtn");
const cartRemoveBtn = document.querySelector("#cartRemoveBtn");
const cartDOM = document.querySelector("#cartDOM");
const cartProductsDOM = document.querySelector("#cartProductsDOM");
const cartNumber = document.querySelector("#cartNumber");
const cartPriceTotal = document.querySelector("#cartPriceTotal");

// Cart
let cart = [];
// buttons
let buttonsDOM = [];

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
                        <button data-id=${product.id} class="product--cart bagBtn">
                            Add to cart <ion-icon name="cart"></ion-icon>
                        </button>
                    </div>
                </div>
            `;
        });

        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bagBtn")];
        buttonsDOM = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => item.id === id);

            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }

            button.addEventListener("click", (e) => {
                e.target.innerText = "In Cart";
                e.target.disabled = true;

                // Get product from products
                let cartItem = { ...Storage.getProduct(id), amount: 1 };
                // add product to the cart
                cart = [...cart, cartItem];
                // save the cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValue(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            });
        });
    }

    setCartValue(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;

        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += parseFloat(item.amount);
        });

        cartPriceTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartNumber.innerText = itemsTotal;
    }

    addCartItem(item) {
        const div = document.createElement("div");
        div.classList.add("cart--item");

        div.innerHTML = `
            <div class="cart--img">
                <img
                    src=${item.image}
                    alt="cart img"
                />
            </div>
            <div class="cart--intro">
                <div class="cart--info">
                    <h3 class="cart--name">${item.title}</h3>
                    <p class="cart--price">${item.price}$</p>
                    <input
                        type="number"
                        data-id=${item.id}
                        class="cart--total"
                        value=${item.amount}
                        min="1"
                    />
                </div>
                <button
                    class="cart--remove"
                    data-id=${item.id}
                >
                    remove
                </button>
            </div>
        `;

        cartProductsDOM.appendChild(div);
    }

    showCart() {
        cartDOM.classList.add("open");
    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValue(cart);
        this.populateCart(cart);
    }

    populateCart(cart) {
        cart.forEach((item) => this.addCartItem(item));
    }

    cartLogic() {
        // Cart functionality
        cartProductsDOM.addEventListener("click", (e) => {
            if (e.target.classList.contains("cart--remove")) {
                let removeItem = e.target;
                let id = removeItem.dataset.id;
                cartProductsDOM.removeChild(
                    removeItem.parentElement.parentElement
                );
                this.removeItem(id);
            }

            if (e.target.classList.contains("cart--total")) {
                let itemTotal = e.target;
                let id = itemTotal.dataset.id;

                let tempItem = cart.find((item) => item.id === id);
                tempItem.amount = itemTotal.value;

                Storage.saveCart(cart);
                this.setCartValue(cart);
            }
        });
    }

    removeItem(id) {
        cart = cart.filter((item) => item.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `
        Add to cart <ion-icon name="cart"></ion-icon>
        `;
    }

    getSingleButton(id) {
        return buttonsDOM.find((button) => button.dataset.id === id);
    }
}

// Local Storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));

        return products.find((product) => product.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [];
    }
}

// DOM Loaded Event
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // Set up app
    ui.setupAPP();

    // Get all products
    products
        .getProducts()
        .then((products) => {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });
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
