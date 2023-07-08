const express= require('express');
const router= express.Router();
const upload= require('../upload');
const Item= require('../controllers/item');
const User= require('../controllers/user');
const Cart= require('../controllers/cart');
const Buy= require('../controllers/buy');
const auth= require('../middleware/auth');


//  Items APIs
router.post("/upload", upload.array("images"), Item.createItem);
router.get('/getAllItems',Item.getAllItems);
router.get('/getItem/:itemId', Item.getItemById);
router.delete('/deleteItem/:itemId', Item.deleteItem);

//  User APIs
router.post('/createUser', User.createUser);
router.post('/loginUser', User.loginUser);
router.post('/verify-token',auth.authentication ,User.verifyToken);
router.post('/logOut',auth.authentication,User.logOut);
router.get('/getAllUsers', User.getAllUsers);
router.get('/getUser/:userId',User.getUserById);
router.delete('/deleteUser/:userId', User.deleteUser);

// Cart APIs
router.post('/addToCart/:userId/cart',Cart.addToCart);
router.get('/getAllCarts',Cart.getAllCart);
router.get('/getCart/:userId/cart',Cart.getCartByUserId);
router.delete('/removeCartItem/:userId/:productId', Cart.removeCartItem)

// Buy APIs
router.post('/createOrder',Buy.checkout);
router.post('/verifyOrder',Buy.verifyOrder);



module.exports =router;