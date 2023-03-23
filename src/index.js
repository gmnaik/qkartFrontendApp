import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router} from "react-router-dom";
// import { ThemeProvider } from '@material-ui/core';
// import { theme } from './theme';

// TODO: CRIO_TASK_MODULE_REGISTER - Add Target container ID (refer public/index.html)
ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      preventDuplicate
    >
      
      {/* <ThemeProvider theme={theme}>  */}
        <Router>
          <App />
        </Router>
      {/* </ThemeProvider>  */}
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
