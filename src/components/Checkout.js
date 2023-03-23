import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
 * @typedef {Object} Address - Data on added address
 *
 * @property {string} _id - Unique ID for the address
 * @property {string} address - Full address string
 */

/**
 * @typedef {Object} Addresses - Data on all added addresses
 *
 * @property {Array.<Address>} all - Data on all added addresses
 * @property {string} selected - Id of the currently selected address
 */

/**
 * @typedef {Object} NewAddress - Data on the new address being typed
 *
 * @property { Boolean } isAddingNewAddress - If a new address is being added
 * @property { String} value - Latest value of the address being typed
 */

// TODO: CRIO_TASK_MODULE_CHECKOUT - Should allow to type a new address in the text field and add the new address or cancel adding new address
/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { String } token
 *    Login token
 *
 * @param { NewAddress } newAddress
 *    Data on new address being added
 *
 * @param { Function } handleNewAddress
 *    Handler function to set the new address field to the latest typed value
 *
 * @param { Function } addAddress
 *    Handler function to make an API call to add the new address
 *
 * @returns { JSX.Element }
 *    JSX for the Add new address view
 *
 */

// const AddNewAddressView = ({
//   token,
//   newAddress,
//   handleNewAddress,
//   addAddress,
// }) => {

//   const [cancel,setcancel] = useState(false);

//   const handleCancel = async() =>{
//     console.log("Cancel button clicked");
//     newAddress.isAddingNewAddress = false;
//     setcancel(true);
//   }
  
//   // useEffect(() => {
//   //   setcancel(false);
//   // },[cancel]);

//   console.log("Is adding new address:",handleNewAddress);
//   if(newAddress.isAddingNewAddress === true)
//   {
    
//     return (
//       <Box display="flex" flexDirection="column">
//         <TextField
//           // value={newAddress.value}
//           onClick={handleNewAddress}
//           multiline
//           minRows={4}
//           placeholder="Enter your complete address"
          
//         />
//         <Stack direction="row" my="1rem">
//           <Button
//             variant="contained"
//             onClick={() => addAddress(token,newAddress)}
//           >
//             Add
//           </Button>
//           <Button
//             variant="text"
//             //onClick={handleCancel}
//           >
//             Cancel
//           </Button>
//         </Stack>
//       </Box>
//     );
    
//   }
//   else
//   {
    
//     return (<Box></Box>);
//   }
// };

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [addresslist, setaddresslist] = useState([]);
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });
  
  //const token = window.localStorage.getItem('token');
  const username = window.localStorage.getItem('username');
  const balance = window.localStorage.getItem('balance');

  // console.log("Token in product page:",token);
  // console.log("username in product page:",username);
  // console.log("balance in product page:",balance);

  let logintoken = "";
  let loginusername = "";
  if(token)
  {
    logintoken = token;
    //console.log("Login token for current user:",logintoken);
  }
  if(username)
  {
    loginusername = username;
  }

  console.log("Typed new address:",newAddress);
  // Fetch the entire products list
  const getProducts = async () => {
    try 
    {
      const response = await axios.get(config.endpoint + '/products');
      //console.log("All products in checkout inside getProducts function:",response.data);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) 
      {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } 
      else 
      {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // Fetch cart data
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(config.endpoint + '/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
        setCart(response.data);
        return response.data;

    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  /**
   * Fetch list of addresses for a user
   *
   * API Endpoint - "GET /user/addresses"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const getAddresses = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses({ ...addresses, all: response.data });
      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  /**
   * Handler function to add a new address and display the latest list of addresses
   *
   * @param { String } token
   *    Login token
   *
   * @param { NewAddress } newAddress
   *    Data on new address being added
   *
   * @returns { Array.<Address> }
   *    Latest list of addresses
   *
   * API Endpoint - "POST /user/addresses"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const addAddress = async (token, newAddress) => {
    let payloaddata = {"address": newAddress.value};
    //console.log("Add address function:",payloaddata);
    // {"address":"Test address\n12th street, Mumbai"}
    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Add new address to the backend and display the latest list of addresses
      await axios.post(config.endpoint + '/user/addresses', payloaddata , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((result) => {
        //console.log("Result inside add address:",result);
        
        setAddresses({ ...addresses, all: result.data });
        setNewAddress((currNewAddress) => ({
          ...currNewAddress,
          isAddingNewAddress: false,
       
        }));
        setaddresslist(result.data);
      }
      )

      // console.log("Adding address in add address function:",response.data)
      // setAddresses({ ...addresses, all: response.data });
      // return response.data;

    } catch (e) {
      if (e.response.data) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        console.log("Error of address",e.response.data.message);
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  /**
   * Handler function to delete an address from the backend and display the latest list of addresses
   *
   * @param { String } token
   *    Login token
   *
   * @param { String } addressId
   *    Id value of the address to be deleted
   *
   * @returns { Array.<Address> }
   *    Latest list of addresses
   *
   * API Endpoint - "DELETE /user/addresses/:addressId"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const deleteAddress = async (token, addressId) => {
    if (!token) return;

    // console.log("Token in delete address:",token);
    // console.log("Address ID in delete address:",addressId);

    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Delete selected address from the backend and display the latest list of addresses
      await axios.delete(config.endpoint + '/user/addresses/' + addressId , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((result) =>{
        //console.log("Inside delete address:",result);
        setaddresslist(result.data);
      })

    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Validate request for checkout
  /**
   * Return if the request validation passed. If it fails, display appropriate warning message.
   *
   * Validation checks - show warning message with given text if any of these validation fails
   *
   *  1. Not enough balance available to checkout cart items
   *    "You do not have enough balance in your wallet for this purchase"
   *
   *  2. No addresses added for user
   *    "Please add a new address before proceeding."
   *
   *  3. No address selected for checkout
   *    "Please select one shipping address to proceed."
   *
   * @param { Array.<CartItem> } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    Whether validation passed or not
   *
   */
  const validateRequest = (items, addresses) => {
    //console.log("Inside validate request addresses length",addresses.all.length);

    let validationresult = false;
    if(getTotalCartValue(items) < localStorage.getItem("balance"))
    {
      if(addresses.all.length > 0)
      {
        if(addresses.selected)
        {
          validationresult = true;
        }
        else
        {
          enqueueSnackbar(
            "Please select one shipping address to proceed.",
            {
              variant: "warning",
            }
          );
          
        }
      }
      else
      {
        enqueueSnackbar(
          "Please add a new address before proceeding.",
          {
            variant: "warning",
          }
        );
        
      }
    }
    else
    {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        {
          variant: "warning",
        }
      );
      
    }
    return validationresult;
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT
  /**
   * Handler function to perform checkout operation for items added to the cart for the selected address
   *
   * @param { String } token
   *    Login token
   *
   * @param { Array.<CartItem } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    If checkout operation was successful
   *
   * API endpoint - "POST /cart/checkout"
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *  "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *  "success": false,
   *  "message": "Wallet balance not sufficient to place order"
   * }
   *
   */
  const performCheckout = async (token, items, addresses) => {
    // console.log("Token inside perform checkout:",token);
    // console.log("Cart items inside perform checkout:",items);
    // console.log("Address list and selected inside perform checkout:",addresses);

    let payloaddata = {"addressId": addresses.selected};

    let balancedata = localStorage.getItem('balance');
    //console.log("Balance in perform checkout",balancedata);

    //let remainingbalance = balancedata - getTotalCartValue(items);
    //console.log("Remaining balance:",remainingbalance);

    //let remainedbalance = localStorage.setItem('balance',JSON.stringify(remainingbalance));
    //console.log("Remaining balance after reduction in storage:",remainedbalance);

    if(!token) return;

    if(validateRequest(items,addresses) === true)
    {
      //console.log("Validation successfull");
      try
      {
        await axios.post(config.endpoint + '/cart/checkout', payloaddata, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
         }).then((result) => {
            let remainingbalance = balancedata - getTotalCartValue(items);
            localStorage.setItem('balance',JSON.stringify(remainingbalance));
           
            enqueueSnackbar(
              "Order placed successfully",
              {
                variant: "success",
              }
            )
            history.push('/thanks');
         }
         )
      }catch(e)
      {
        enqueueSnackbar(
          e.response.message.data,
          {
           variant: "error",
          }
        );
      }
    }
    else
    {
      return;
    }

  };

  const [cancel,setcancel] = useState(false);

  const handleCancel = async() =>{
    console.log("Cancel button clicked");
    newAddress.isAddingNewAddress = false;
    newAddress.value = "";
    setcancel(true);
  }

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Fetch addressses if logged in, otherwise show info message and redirect to Products page


  // Fetch products and cart data on page load
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();

      const cartData = await fetchCart(token);

      // console.log("All products in useEffect:",productsData);
      // console.log("Cart Data in useEffect:",cartData);
      // if (productsData && cartData) 
      // {
      //   const cartDetails = await generateCartItemsFrom(cartData, productsData);
      //   setItems(cartDetails);
      //   console.log("Cart details from generateCartItemsFrom() in checkout:",cartDetails);
      // }
      const cartDetails = await generateCartItemsFrom(cartData, productsData);
      setItems(cartDetails);

      const completeaddresslist = await getAddresses(token);
      setaddresslist(completeaddresslist);
      //console.log("Complete address list:",completeaddresslist);
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setcancel(false);
  }, [cancel]);

  const handleNewAddress = (event) => {
    setNewAddress((currNewAddress) => ({
      ...currNewAddress,
      value: event.target.value,
   
    }));
  }

  const selectaddress = (addressselected) =>{
    //console.log("Selected address:",addressselected);
    setAddresses({...addresses, selected: addressselected._id });
  }

  //console.log("Address to check whether selected:",addresses);

  return (
    <>
      <Header childrencomponent="checkout" hasHiddenAuthButtons={logintoken} userInfo={loginusername} />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Display list of addresses and corresponding "Delete" buttons, if present, of which 1 can be selected */}
               <Grid container>
                {addresslist ? 
                  (
                    <Box display="flex" flexDirection="column">
                      {addresslist.map(user =>
                        <Box display="flex" flexDirection="row" onClick={()=>selectaddress(user)} className={addresses.selected === user._id ? `selected address-item` : `address-item`}>
                          <Typography my="1rem" className="address-item">
                            {user.address}
                          </Typography>
                          <IconButton idName="add-new-btn" onClick={() => deleteAddress(token,user._id)} aria-label="delete" color="success" size="small" endIcon={<Delete />} >
                            <Delete />DELETE
                          </IconButton>
                        </Box>
                          
                      )}
                     </Box>
                  ) : 
                  (
                    <Typography my="1rem">
                      No addresses found for this account. Please add one to proceed
                    </Typography>
                  )
                }
               </Grid>
            </Box>

            {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
            {newAddress.isAddingNewAddress ? (<Box></Box>) : (
              <Button
                  color="primary"
                  variant="contained"
                  id="add-new-btn"
                  size="large"
                  onClick={() => {
                    setNewAddress((currNewAddress) => ({
                      ...currNewAddress,
                      isAddingNewAddress: true,
                  
                    }));
                  }}
                >
                  Add new address
              </Button>
            )
            }

            {/* <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
            /> */}
            {newAddress.isAddingNewAddress ?
            (
              <Box display="flex" flexDirection="column">
                <TextField
                  value={newAddress.value}
                  onChange={handleNewAddress}
                  multiline
                  minRows={4}
                  placeholder="Enter your complete address"
                />
                <Stack direction="row" my="1rem" spacing={20}>
                  <Button
                    variant="contained"
                    id="add-btn"
                    onClick={() => addAddress(token,newAddress)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="text"
                    id="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Box></Box>
             )
            }
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              id="add-new-btn"
              onClick= {() => performCheckout(token,items,addresses)}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly={true} cartData={cart} products={products} /> 
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
