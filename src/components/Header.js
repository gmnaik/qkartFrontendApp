import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { Avatar, Button, Stack,InputAdornment,
  TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
import Login from "./Login";

const Header = ({ children, childrencomponent, hasHiddenAuthButtons, userInfo }) => {

    //console.log("Children:",children);
    //console.log("hasHiddenAuthButtons:",hasHiddenAuthButtons);
    const history = useHistory();

    const logout = () => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('balance');
      history.push('/');
      window.location.reload();
      //console.log("Logged out")
    }

    if(childrencomponent === "register" || childrencomponent === "login")
    {
      return (
        <Box className="header">
          <Box className="header-title">
              <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
          
           <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
            >
            Back to explore
          </Button>
        </Box>
        
      );
    }
    else if((childrencomponent === "products" && (hasHiddenAuthButtons)) || (childrencomponent === "checkout" && (hasHiddenAuthButtons)) || (childrencomponent === "thanks" && (hasHiddenAuthButtons)))
    {
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Stack>
          {children}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <Avatar alt="crio.do" src="avatar.png" />
        <p><b>{userInfo}</b></p>
        <Button className="button" variant="contained" onClick={logout} type="submit">
        LOGOUT
        </Button>
        </Stack>
        
      </Box>
      
    );
    }
    else if(childrencomponent === "products" && (!hasHiddenAuthButtons))
    {
      return (
        <Box className="header">
          <Box className="header-title">
              <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
        <Stack>
          {children}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Button className="button" variant="contained"  type="submit"
          onClick={() => history.push("/login")}>
          LOGIN
          </Button>
          <Button className="button" variant="contained"  type="submit"
          onClick={() => history.push("/register")}>
          REGISTER
          </Button>
          </Stack>
        </Box>
        
      );
    }
    else{
      return (
        <Box className="header">
          <Box className="header-title">
              <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
          
           <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push("/")}
            >
            Back to explore
          </Button>
        </Box>
        
      );
    }
};

export default Header;
