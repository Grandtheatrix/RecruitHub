import { createStore } from "redux";

function reducer(store, action) {
  if (!store) {
    return {
      flashMessage: "",
      navigationData: [],
      lookupData: null,
      currentUser: null
    };
  }
  if (action.type === "SET_FLASH_MESSAGE") {
    return {
      ...store,
      flashMessage: action.value,
      flashMessageSeverity: action.severity || "success"
    };
  }
  if (action.type === "SET_NAVIGATION_DATA") {
    return {
      ...store,
      navigationData: action.value
    };
  }
  if (action.type === "SET_LOOKUP_DATA") {
    return {
      ...store,
      lookupData: action.value
    };
  }
  if (action.type === "SET_CURRENT_USER") {
    return {
      ...store,
      currentUser: action.value
    };
  }
}

export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
