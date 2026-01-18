import EmptyCart from "@/components/EmptyCart";

export default function CarritoPage() {
  // 🔴 Luego aquí conectas tu cart real
  const items: any[] = [];

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      {/* Aquí va el carrito con productos */}
      <h1 className="text-2xl font-semibold">Tu carrito</h1>
    </div>
  );
}
