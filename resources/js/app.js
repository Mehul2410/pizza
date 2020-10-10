import axios from "axios";
import Noty from "noty";
import { initAdmin } from "./admin";
import moment from 'moment'

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



// change order statusController
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value:null
order = JSON.parse(order)

let time = document.createElement('small')


// Change order status
function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove('stepCompleted')
    status.classList.remove('current')
  })
  let stepCompleted = true;

  statuses.forEach((status) => {
    let dataProp = status.dataset.status
    if(stepCompleted) {
      status.classList.add('step-completed')
    }
    if(dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format('hh:mm A')
      status.appendChild(time)
      if(status.nextElementSibling) {
        status.nextElementSibling.classList.add('current')
      }
    }
  })
}

updateStatus(order);

//socket
let socket = io()
initAdmin(socket);
// join 
if(order){
  socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
  socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated' , (data) => {
  const updatedOrder = {...order}
  updatedOrder.updatedAt = moment().format()
  updatedOrder.status = data.status
  updateStatus(updatedOrder)
  new Noty({
    type: "success",
    timeout: 1000,
    text: "Order updated",
    progressBar: false,
  }).show();
})



