import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { z } from "zod";

import { SpecScreen } from "@/lib/json-render/SpecScreen";
import { orderDetailSpec } from "@/specs/order-detail";

const orderParamsSchema = z.object({
  id: z.union([z.string(), z.array(z.string()).transform((a) => a[0])]),
  title: z
    .union([z.string(), z.array(z.string()).transform((a) => a[0])])
    .optional()
    .default(""),
  status: z
    .union([z.string(), z.array(z.string()).transform((a) => a[0])])
    .optional()
    .default("pending"),
  amount: z
    .union([z.string(), z.array(z.string()).transform((a) => a[0])])
    .optional()
    .default("$0.00"),
});

export default function OrderDetailScreen() {
  const raw = useLocalSearchParams();
  const params = orderParamsSchema.parse(raw);

  const extraState = useMemo(
    () => ({
      orderId: params.id,
      orderTitle: params.title,
      orderStatus: params.status,
      orderAmount: params.amount,
    }),
    [params.id, params.title, params.status, params.amount],
  );

  return (
    <SpecScreen spec={orderDetailSpec} type="detail" extraState={extraState} />
  );
}
