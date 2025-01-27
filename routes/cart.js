const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

router.use(cookieParser());

/* 
Endpoint:
	POST  /cart/

Purpose:
  Adds an Item to the logged in current user's cart. If the Item already exists in the cart, that Item gets
  updated with the new provided quantity.
  
Credentials accepted: Basic user, Admin

Request Body: Is an object, with the following keys -
  itemId: The Document ID of the Item to be added to the cart
    type: String
    REQUIRED
  
  qty: The quantity of the Item to be added to the cart
    type: Number
    REQUIRED

Response:
  Responds with an array in JSON format containing the new cart items.
  Each element of the array is an object of the format: { itemId, qty, price },
  where the keys have their obvious meanings.
  
Example axios request:
const result = await axios({
  method: 'post',
  url: '/cart/',
  withCredentials: true,
  data: {itemId:id_of_item_to_add_to_cart,qty:quantity_of_that_item_to_add_to_cart},
});

 */

router.post("/", auth, async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const qty = req.body.qty;
    const dip = req.body.dip;
    const spicy = req.body.spicy;
    const vegetarian = req.body.vegetarian;
    const delivery_time = req.body.delivery_time;
    const side = req.body.side;
    const mainItem = req.body.mainItem;
    const tacoShell = req.body.tacoShell;
    if (itemId === null || qty === null) {
      throw { message: "Error adding to cart" };
    }
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { cart: { itemId: itemId } } },
      { multi: false }
    );
    const user = await User.findById(req.user.id);
    const item = await Item.findById(itemId);
    if (item === undefined) {
      throw { message: "Item ID not found in the store" };
    }

    if (itemId == "60e3a111557dc20017253d84") { //samosabucket - momo dumplings
      user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price, dip: dip, spicy: spicy, vegetarian: vegetarian, item_name: item.name, delivery_time: delivery_time}];
    } else if (itemId == "60e3a121557dc20017253d87") { //samosabucket - momo dumplings
      user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price, dip: dip, spicy: spicy, vegetarian: vegetarian, item_name: item.name, delivery_time: delivery_time}];
    } else if (itemId == "60ebcb00cd34f90017ac82c7") { //samosabucket - chicken tikka
      user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price, side: side, spicy: spicy, vegetarian: vegetarian, item_name: item.name, delivery_time: delivery_time}];
    } else if (itemId == "60f892c28b572f0017ef81ed") { //samosabucket - samosa
      user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price, dip: dip, spicy: spicy, item_name: item.name, delivery_time: delivery_time}];
    } else if (itemId == "60dcf34954590a0017027dd4") { //vegan flava cafe - Too Tasty Walnut Tacos
      user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price, tacoShell: tacoShell, mainItem: mainItem, item_name: item.name, delivery_time: delivery_time}];
    } else if (itemId == "60dcf48854590a0017027dd5") { //vegan flava cafe - Mock Fish Cake
      user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price, tacoShell: tacoShell, mainItem: mainItem, item_name: item.name, delivery_time: delivery_time}];
    } 
    
    else { //everything else. Items without a modal popup
      user.cart = [...user.cart, { itemId: itemId, qty: qty, price: item.price, item_name: item.name, delivery_time: delivery_time}];
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

/* 
Endpoint:
  DELETE  /cart/:id
  Where ":id" is the itemId of the object to be removed from the user's cart.

Purpose:
  Removes an item from the user's cart
  
Credentials accepted: Basic user, Admin

Request Body: Empty

Response:
  Responds with an array in JSON format containing the updated cart.
  Each element of the array is an object of the format: { itemId, qty, price },
  where the keys have their obvious meanings.
  
Example axios request:
const result = await axios({
  method: 'delete',
  url: '/cart/'+id_of_item_to_delete_from_cart,
  withCredentials: true,
});

 */

router.delete("/:id", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    if (itemId === null) {
      throw { message: "Error removing from cart" };
    }
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { cart: { itemId: itemId } } },
      { multi: false }
    );
    const user = await User.findById(req.user.id);
    //console.log(user.cart);
    res.status(200).json(user.cart);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

/* 
Endpoint:
	DELETE  /cart/

Purpose:
  Removes all items from the user's cart, used when an order payment is successful to flush the cart.

Credentials accepted: Basic user, Admin

Request Params: Empty

Request Body: Empty

Response:
  Responds with an array in JSON format containing the updated cart (which is, an empty array).

Example axios request:
const result = await axios({
  method: 'delete',
  url: '/cart/',
  withCredentials: true,
});

 */

router.delete("/", auth, async (req, res) => {
  try {
    const itemId = req.params.id;
    if (itemId === null) {
      throw { message: "Error removing from cart" };
    }
    await User.updateOne(
      { _id: req.user.id },
      { $set: { cart: [] } },
      { multi: false }
    );
    const user = await User.findById(req.user.id);
    //console.log(user.cart);
    res.status(200).json(user.cart);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
