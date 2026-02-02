import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  // Importante: el carrito vive en cliente (Zustand/localStorage),
  // así que el checkout real debe renderizarse en un Client Component.
  return <CheckoutClient />;
}
