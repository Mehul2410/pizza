import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");
function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item Added to Cart",
        progressBar: false,
      }).show();
      cartCounter.innerText = res.data.totalQty;
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went wrong",
        progressBar: false,
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

//Remove alert message after x seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();
