import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import {green} from '@mui/material/colors';
import Cart from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  //const [token,setToken] = useState("false");

  // const logininfo = window.localStorage.getItem('loginInfo');
  // // const parselogininfo = JSON.parse(logininfo);
  // // let logininfotoken = "";
  // // //setToken(parselogininfo.token);
  // // console.log("logininfo inside product function:",parselogininfo);
  // // //console.log("Token inside product function:",token);
  // // if(parselogininfo)
  // // {
  // //   logininfotoken = parselogininfo.token;
  // // }
  // // else
  // // {
    
  // // }

  const [allproduct,setallProduct] = useState([]);
  const {enqueueSnackbar} = useSnackbar();
  const [loading,setLoading] = useState(false);
  const [searchtext,setsearchtext] = useState(false);
  const [searchresult,setsearchresult] = useState([]);
  const [searchnotfound,setsearchnotfound] = useState(false);
  const [searchnotfoundtext,setsearchnotfoundtext] = useState("");
  const [cartdata,setcartdata] = useState([]);

  const token = window.localStorage.getItem('token');
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

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  //const [token,setToken] = useState("false");

  

  const performAPICall = async () => {
    try
    {
        setLoading(true);
        await axios.get(config.endpoint + '/products')
        .then((result) => {
         ///console.log("Products:",result.data);
         const productresultdata = result.data;
         setsearchresult(productresultdata);
         setallProduct(productresultdata);
        })
        setLoading(false);
        //console.log("Products:",allproducts.data);
    }
    catch(e){
      if(e.response && (e.response.status === 400))
      {
        enqueueSnackbar(e.response.data.message, { variant: 'error' }); 
      }
      else
      {
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON', { variant: 'error' }); 
      }
    }

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */ 

  const performSearch = async (text) => {
    //console.log("In search:",text);
    try{
      setsearchnotfound(false);
      //setsearchtext(true);
      await axios.get(config.endpoint + '/products/search?value=' + text).then((result) => {
          //console.log("Searched products:",result);
          const searchresultdata = result.data;
          setsearchresult(searchresultdata);
         
        })
    }catch(e){
      //console.log("Error status code:",e.response.status);
      if(e.response && e.response.status === 404)
      {
        setsearchnotfound(true);
        setsearchnotfoundtext("No products found"); 
        console.log("Search not found in catch");
        //console.log("Error status code:",e.response.status);
        
      }
      else
      {
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON', { variant: 'error' }); 
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  
  const [debounce,setdebounce] = useState();
  const debounceSearch = async (event,debounceTimeout) => {
    ///console.log("In debounce:",event.target.value);
    const value = event.target.value;
    if(debounce)
    {

      clearTimeout(debounce);
    }

    
    const debouncetime = setTimeout(()=>{
      performSearch(value);
    },500);
    setdebounce(debouncetime);
  };

  


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
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
  const fetchCart = async (token) => {
    if (!token) return;

    console.log("Cart token:",token);
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      await axios.get(config.endpoint + '/cart',{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      }).then((result) => {
        //console.log("Data from fetch cart:",result.data);
        setcartdata(result.data);
      })
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        console.log("Error in fetching Cart items:",e.response.data.message);
      } 
      else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let key=productId;
    let itemincart = false;
    for(let i=0;i<items.length;i++)
    {
      if(key === items[i].productId)
      {
        itemincart = true;
      }
    }
    return itemincart;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false, type: undefined}
  ) => {

    console.log("Token in add to cart:",token);
    console.log("Items in add to cart:",items);
    console.log("Products in add to cart:",products);
    console.log("Product ID in add to cart:",productId);
    console.log("Quantity in add to cart:",qty);
    console.log("Options in add to cart:",options);
    if(token)
    {
      if(isItemInCart(items,productId) === true && options.preventDuplicate != true)
      {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        });

      }
      else
      {
        if(options.preventDuplicate === true)
        {
          let payloaddata;
          if(options.type === "add")
          {
            payloaddata = {"productId":productId, "qty":qty+1};
          }
          else
          {
            payloaddata = {"productId":productId, "qty":qty-1};
          }
          try 
          {
            await axios.post(config.endpoint + '/cart',payloaddata,{
              headers:{
                'Authorization': `Bearer ${token}`
              }
            }).then((result) => {
              console.log("Inside adding products to cart by post",result);
              setcartdata(result.data);
            })
          } 
          catch (e) 
          {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } 
        }
        else
        {
        try 
          {
            await axios.post(config.endpoint + '/cart',{"productId":productId, "qty":1},{
              headers:{
                'Authorization': `Bearer ${token}`
              }
            }).then((result) => {
              console.log("Inside adding products to cart by post",result);
              setcartdata(result.data);
            })
          } 
          catch (e) 
          {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } 
        } 
      }
    }

    else
    {
      enqueueSnackbar("Login to add an item to the Cart",
        {
          variant: "warning",
        });
    }
  };

  useEffect(() => {
    // code to run after render goes here
    performAPICall();
    fetchCart(logintoken);
  },[]);

  

  return (
    <div>
      <Header childrencomponent="products" hasHiddenAuthButtons={logintoken} userInfo={loginusername}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        {/* Search view for desktop */}
          
          <TextField
            className="search-desktop" 
          
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e) => debounceSearch(e,500)}
          />
        
      </Header>

      {/* Search view for mobile */}
      <TextField
        className="search-mobile" 
       
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e,500)}
      />

      {logintoken ? (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container rowSpacing={3} columnSpacing={2.5}>
            <Grid item xs={12} md={8}>
              <Grid container>
                <Grid item className="product-grid">
                  <Box className="hero">
                    <p className="hero-heading">
                      India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                      to your door step
                    </p>
                  </Box>
                </Grid>
                {/* </Grid> */}

                {loading ? (
                  <div>
                    <CircularProgress
                      size={24}
                      sx={{
                      color: green[500],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                      }}
                    />
                    <p>Loading Products</p>
                  </div>
                  ) :
                  (
                    <ProductCard product={searchresult} handleAddToCart={addToCart} searchnotfoundtexts={searchnotfound} token={token} cartData={cartdata} products={allproduct} qty={null}/>
                    // <ProductCard product={allproduct} />
                  )
                }
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Cart isReadOnly={false} cartData={cartdata} products={allproduct} handleQuantity={addToCart}/>
            </Grid>
          </Grid>
        </Box>
      ):
      (
        <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
            </p>
          </Box>
        </Grid>
      {/* </Grid> */}

      
      {loading ? (
        <div>
          <CircularProgress
            size={24}
            sx={{
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
            }}
          />
          <p>Loading Products</p>
        </div>
        ) :
        (
          <ProductCard product={searchresult} handleAddToCart={(e)=>addToCart(token,cartdata,allproduct,cartdata.productId,cartdata.qty,1)} searchnotfoundtexts={searchnotfound} qty={null}/>
          // <ProductCard product={allproduct} />
        )
      }
      </Grid>
      )
    }
      <Footer />
    </div>
  );
};

export default Products;
