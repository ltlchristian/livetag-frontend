import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";
const PUBLIC_KEY =
  "pk_test_51L2E07G0ywpc2Cov3KKU9rvJCwNZA4Z3YZ3MaBrRuOIDKQDQZm4Xe7QqzxZ3k6yh5ockST9ykxvDXvOESqCeP2dB00TiTRMIV4";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeContainer;
