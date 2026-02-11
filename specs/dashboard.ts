import type { Spec } from "@json-render/core";
import { createScreenSpec, headerElements, sectionElements } from "./builders";

export const dashboardSpec: Spec = createScreenSpec({
  state: {},
  headerKey: "header",
  header: headerElements({
    title: "dashboard",
    subtitle: "your overview",
  }),
  bodyChildren: ["statsSection", "divider1", "activitySection"],
  body: {
    statsSection: {
      type: "Container",
      props: { padding: 16 },
      children: ["statsRow"],
    },
    statsRow: {
      type: "Row",
      props: { gap: 12 },
      children: ["stat1", "stat2", "stat3"],
    },
    stat1: {
      type: "StatCard",
      props: {
        label: "orders",
        value: "128",
        trend: "up",
        trendValue: "+12%",
        color: "#4CAF50",
      },
    },
    stat2: {
      type: "StatCard",
      props: {
        label: "revenue",
        value: "$4.2k",
        trend: "up",
        trendValue: "+8%",
        color: "#2196F3",
      },
    },
    stat3: {
      type: "StatCard",
      props: {
        label: "customers",
        value: "64",
        trend: "down",
        trendValue: "-3%",
        color: "#FF9800",
      },
    },
    divider1: { type: "Divider", props: { margin: 8 } },
    ...sectionElements({
      key: "activitySection",
      title: "recent activity",
      children: ["activity1", "activity2", "activity3"],
    }),
    activity1: {
      type: "ListItem",
      props: {
        title: "new order #1234",
        subtitle: "2 minutes ago",
        showChevron: true,
      },
      on: {
        press: {
          action: "navigate",
          params: {
            screen: "/order/[id]",
            params: {
              id: "1234",
              title: "new order #1234",
              status: "pending",
              amount: "$42.50",
            },
          },
        },
      },
    },
    activity2: {
      type: "ListItem",
      props: {
        title: "payment received",
        subtitle: "15 minutes ago",
        showChevron: true,
      },
      on: {
        press: {
          action: "navigate",
          params: {
            screen: "/order/[id]",
            params: {
              id: "5678",
              title: "payment received",
              status: "completed",
              amount: "$128.00",
            },
          },
        },
      },
    },
    activity3: {
      type: "ListItem",
      props: { title: "new customer signup", subtitle: "1 hour ago" },
    },
  },
});
