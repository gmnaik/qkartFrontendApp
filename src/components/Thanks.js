import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import "./Thanks.css";

const Thanks = () => {
  const history = useHistory();

  const token = localStorage.getItem("token");
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

  const routeToProducts = () => {
    history.push("/");
  };

  useEffect(() => {
    //const token = localStorage.getItem("token");
    
    if (!token) {
      history.push("/");
    }
  }, [history]);

  return (
    <>
      <Header childrencomponent="thanks" hasHiddenAuthButtons={logintoken} userInfo={loginusername} />
      <Box className="greeting-container">
        <h2>Yay! It's ordered 😃</h2>
        <p>You will receive an invoice for your order shortly.</p>
        <p>Your order will arrive in 7 business days.</p>
        <p id="balance-overline">Wallet Balance</p>
        <p id="balance">${balance} Available</p>
        <Button
          variant="contained"
          size="large"
          id="continue-btn"
          onClick={routeToProducts}
          name="continue shopping"
        >
          Continue Shopping
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default Thanks;
