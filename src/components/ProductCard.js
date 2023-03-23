import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Box,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { SentimentDissatisfied } from "@mui/icons-material";
//import {Product.addToCart} from "./Products";

const ProductCard = ({ product, handleAddToCart,searchnotfoundtexts, token, cartData, products, qty }) => {
  console.log("Search prop:",product);

  return (searchnotfoundtexts === true) ? (<div className="no-products">
    <SentimentDissatisfied /><h3>No products found</h3>
</div>) : (
    <Box sx={{ flexGrow: 1 }}>
    <Grid container rowSpacing={3} columnSpacing={2.5}>

    {product.map(user =>
    <Grid item xs={6} md={3}>
    <Card className="card">
      <CardActionArea>
        <CardMedia
          component="img"
          height="300"
          image={user.image}
          alt={user.name}
          align="center"
          name={user.name}
        />
        <CardContent>
          
          <Typography gutterBottom variant="h5" component="div" name={user.name}>
            {user.name}
          </Typography>
          
          <Typography gutterBottom variant="h5" color="black" >
            <b>${user.cost}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Rating name="read-only" value={user.rating} readOnly />
          </Typography>
        </CardContent>
        </CardActionArea>
      <CardActions>
        <Button className="cardbutton" variant="contained" name="add to cart" role="button" onClick={() => handleAddToCart(token,cartData,products,user._id,qty)}
        >
        <AddShoppingCartOutlined/>ADD TO CART
        </Button>
      </CardActions>
      
    </Card>
    
    </Grid>
    )}
    </Grid>
    </Box>
  )

};

export default ProductCard;
