"use client";

import { Provider } from "react-redux";
import React from "react";
import { store } from "@/store/store";

const Pro = ({ children }: any) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Pro;
