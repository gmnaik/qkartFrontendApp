import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
//import { useHistory, Link } from "react-router-dom";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */

export const generateCartItemsFrom = (cartData, productsData) => {
  console.log("Cart data in cart.js:",cartData);
  console.log("All products in cart.js:",productsData);

  let completecartdata = [];
  for(let i=0;i<cartData.length;i++)
  {
    let key = cartData[i];
    for(let j=0;j<productsData.length;j++)
    {
      if(key.productId === productsData[j]._id)
      {
        productsData[j].quantity = key.qty;
        completecartdata.push(productsData[j]);
      }
    }
  }
  //let completeCartDataWithQuantity = addQuantityInCartArray(cartData,completecartdata);
  console.log("Complete cart data:",completecartdata);
  return (completecartdata);
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalCart = 0;
  for(let i=0;i<items.length;i++)
  {
    totalCart = totalCart + (items[i].cost * items[i].quantity);
    //console.log("Items cost in total cart:",items[i].cost);
  }
  console.log("Items in total cart:",totalCart);
  return (totalCart);
};




// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  isReadOnly,
  value,
  handleAdd,
  handleDelete,
}) => {

  console.log("Is read only:",isReadOnly);

  if(isReadOnly === true)
  {
    return (
      <Stack direction="row" alignItems="center">
      <Box padding="0.5rem" data-testid="item-qty">
        Qty: {value}
      </Box>
      </Stack>
    )
  }
  else
  {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
  }
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
 

const Cart = ({
  isReadOnly,
  cartData,
  products,
  items = [],
  handleQuantity,
}) => {

  const history = useHistory();
  items = generateCartItemsFrom(cartData,products);

  console.log("Items array in cart",items);
  console.log("Is read only in cart function:",isReadOnly);
  let isReadOnlyValue = isReadOnly;

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        
        {items.map(cartitem =>
          <Box display="flex" alignItems="flex-start" padding="1rem">
            <Box className="image-container">
              <img
                // Add product image
                src={cartitem.image}
                // Add product name as alt eext
                alt={cartitem.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{cartitem.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                isReadOnly = {isReadOnlyValue}

                value = {cartitem.quantity}

                handleAdd={() =>
                  handleQuantity(
                    localStorage.getItem("token"),
                    cartData,
                    products,
                    cartitem._id,
                    cartitem.quantity,
                    { preventDuplicate: true, type: "add" }
                  )
                }
                handleDelete={() =>
                  handleQuantity(
                    localStorage.getItem("token"),
                    cartData,
                    products,
                    cartitem._id,
                    cartitem.quantity,
                    { preventDuplicate: true, type: "remove" }
                  )
                }
                
                />
                
                <Box padding="0.5rem" fontWeight="700">
                  ${cartitem.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        
        {isReadOnly ? 
          (<Box
            className="cart"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            // height="6rem"
            paddingX="1rem"
            paddingY="1rem"
           >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginTop: "1rem" }}
              >
                Order Details
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography sx={{ marginTop: "0.3rem" }}>Products</Typography>
              <Typography>{items.length}</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography sx={{ marginTop: "0.3rem" }}>Subtotal</Typography>
              <Typography>${getTotalCartValue(items)}</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography sx={{ marginTop: "0.3rem" }}>
                Shipping Charges
              </Typography>
              <Typography>{0}</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  marginTop: "0.3rem",
                  marginBottom: "1rem",
                }}
              >
                Total
              </Typography>
              <Typography>${getTotalCartValue(items)}</Typography>
            </Box>
          </Box>
          )
            :
          (
            <Box display="flex" justifyContent="flex-end" className="cart-footer">
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                onClick={() => history.push("/checkout")}
              >
                Checkout
              </Button>
            </Box>
          )
        }
      </Box>
    </>
  );
};

export default Cart;
