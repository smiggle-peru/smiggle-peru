import Image from "next/image";

export function OrderSummary({ order }: { order: any }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Resumen de tu compra</h3>

      <div className="space-y-4">
        {order.items.map((item: any, i: number) => (
          <div key={i} className="flex gap-4">
            <Image
              src={item.image}
              alt={item.title}
              width={80}
              height={80}
              className="rounded-md border"
            />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              {item.color_name && (
                <p className="text-sm text-gray-500">
                  Color: {item.color_name}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Cantidad: {item.qty}
              </p>
            </div>
            <p className="font-semibold">
              S/ {(item.unit_price * item.qty).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>S/ {order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>S/ {order.shipping_cost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>S/ {order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
