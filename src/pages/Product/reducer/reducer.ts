import { Action } from "./actions";

interface State {
  counter: number;
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return { ...state, counter: state.counter + 1 };
    case "decrement":
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};
