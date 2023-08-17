import { legacy_createStore, applyMiddleware, compose } from "redux";
import rootReducer from "@reducers/index";
import thunk from "redux-thunk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const composeEnhancers =
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = legacy_createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
