import type { Spec } from "@json-render/core";
import {
  createScreenSpec,
  headerWithBackElements,
  sectionElements,
} from "./builders";

export const orderDetailSpec: Spec = createScreenSpec({
  state: {
    orderId: "",
    orderTitle: "",
    orderStatus: "pending",
    orderAmount: "$0.00",
  },
  headerKey: "header",
  header: headerWithBackElements({ title: "order details" }),
  bodyChildren: ["orderInfo", "divider1", "statusSection"],
  body: {
    orderInfo: {
      type: "Container",
      props: { padding: 16 },
      children: ["orderTitleText", "orderIdText", "orderAmountText"],
    },
    orderTitleText: {
      type: "Heading",
      props: {
        text: { $path: "/orderTitle" },
        level: "h2",
      },
    },
    orderIdText: {
      type: "Paragraph",
      props: {
        text: { $path: "/orderId" },
      },
    },
    orderAmountText: {
      type: "Heading",
      props: {
        text: { $path: "/orderAmount" },
        level: "h1",
      },
    },
    divider1: { type: "Divider", props: { margin: 8 } },
    ...sectionElements({
      key: "statusSection",
      title: "status",
      children: ["statusBadge"],
    }),
    statusBadge: {
      type: "Badge",
      props: {
        label: { $path: "/orderStatus" },
        variant: {
          $cond: { eq: [{ path: "/orderStatus" }, "completed"] },
          $then: "success",
          $else: "warning",
        },
      },
    },
  },
});
