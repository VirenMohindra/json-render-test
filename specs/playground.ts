import type { Spec } from "@json-render/core";

export const playgroundSpec: Spec = {
  root: "page",
  state: {
    name: "",
    count: 0,
    darkMode: false,
    todos: [{ text: "learn json-render" }, { text: "build something cool" }],
    newTodo: "",
  },
  elements: {
    page: {
      type: "ScrollContainer",
      props: {},
      children: [
        "header",
        "greeting",
        "divider1",
        "counterCard",
        "divider2",
        "todoCard",
        "divider3",
        "settingsCard",
      ],
    },

    // --- Header ---
    header: {
      type: "Container",
      props: { padding: 16 },
      children: ["title", "subtitle"],
    },
    title: {
      type: "Heading",
      props: { text: "json-render playground", level: "h1" },
    },
    subtitle: {
      type: "Paragraph",
      props: {
        text: "a hardcoded spec rendered with react native components",
      },
    },

    // --- Dynamic greeting ---
    greeting: {
      type: "Container",
      props: { padding: 16 },
      children: ["nameInput", "greetingText"],
    },
    nameInput: {
      type: "TextInput",
      props: {
        placeholder: "type your name...",
        statePath: "/name",
        label: "your name",
      },
    },
    greetingText: {
      type: "Heading",
      props: {
        text: {
          $cond: { neq: [{ path: "/name" }, ""] },
          $then: { $path: "/name" },
          $else: "...",
        },
        level: "h3",
      },
      visible: { neq: [{ path: "/name" }, ""] },
    },

    // --- Dividers ---
    divider1: { type: "Divider", props: { margin: 8 } },
    divider2: { type: "Divider", props: { margin: 8 } },
    divider3: { type: "Divider", props: { margin: 8 } },

    // --- Counter ---
    counterCard: {
      type: "Card",
      props: { title: "counter" },
      children: ["counterRow", "counterBadge"],
    },
    counterRow: {
      type: "Row",
      props: { gap: 12, justifyContent: "center", alignItems: "center" },
      children: ["decrementBtn", "countLabel", "incrementBtn"],
    },
    decrementBtn: {
      type: "Button",
      props: { label: "-", variant: "outline", size: "sm" },
      on: {
        press: {
          action: "decrement",
          params: { path: "/count", step: 1 },
        },
      },
    },
    countLabel: {
      type: "Heading",
      props: { text: { $path: "/count" }, level: "h2" },
    },
    incrementBtn: {
      type: "Button",
      props: { label: "+", variant: "primary", size: "sm" },
      on: {
        press: {
          action: "increment",
          params: { path: "/count", step: 1 },
        },
      },
    },
    counterBadge: {
      type: "Badge",
      props: {
        label: {
          $cond: { gt: [{ path: "/count" }, 5] },
          $then: "high",
          $else: "normal",
        },
        variant: {
          $cond: { gt: [{ path: "/count" }, 5] },
          $then: "warning",
          $else: "info",
        },
      },
    },

    // --- Todo list ---
    todoCard: {
      type: "Card",
      props: { title: "todo list" },
      children: ["todoInputRow", "todoList"],
    },
    todoInputRow: {
      type: "Row",
      props: { gap: 8, alignItems: "center" },
      children: ["todoInput", "addTodoBtn"],
    },
    todoInput: {
      type: "TextInput",
      props: { placeholder: "new todo...", statePath: "/newTodo", flex: 1 },
    },
    addTodoBtn: {
      type: "Button",
      props: { label: "add", variant: "primary", size: "sm" },
      on: {
        press: {
          action: "pushState",
          params: {
            path: "/todos",
            value: { text: { path: "/newTodo" } },
            clearPath: "/newTodo",
          },
        },
      },
    },
    todoList: {
      type: "Column",
      props: { gap: 4 },
      children: ["todoItem"],
      repeat: { path: "/todos" },
    },
    todoItem: {
      type: "ListItem",
      props: { title: { $path: "$item/text" }, trailing: "x" },
      on: {
        press: {
          action: "removeState",
          params: { path: "/todos", index: "$index" },
        },
      },
    },

    // --- Settings ---
    settingsCard: {
      type: "Card",
      props: { title: "settings" },
      children: ["darkModeSwitch", "alertBtn"],
    },
    darkModeSwitch: {
      type: "Switch",
      props: {
        label: "dark mode (just state, no effect yet)",
        statePath: "/darkMode",
      },
    },
    alertBtn: {
      type: "Button",
      props: { label: "show alert", variant: "secondary" },
      on: {
        press: {
          action: "showAlert",
          params: {
            title: "hello!",
            message: "this alert was triggered by a json-render action",
          },
        },
      },
    },
  },
};
