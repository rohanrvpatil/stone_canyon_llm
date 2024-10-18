// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import App from "./App.tsx";
import "./index.css";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index.ts";

let root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
