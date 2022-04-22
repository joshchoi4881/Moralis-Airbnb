import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import App from "./App";
import "./styles/index.css";

const REACT_APP_MORALIS_SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;
const REACT_APP_MORALIS_APP_ID = process.env.REACT_APP_MORALIS_APP_ID;

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      serverUrl={REACT_APP_MORALIS_SERVER_URL}
      appId={REACT_APP_MORALIS_APP_ID}
    >
      <NotificationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
