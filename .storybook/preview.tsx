import type { Preview, Decorator } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import "../src/styles.css";

const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute({ component: () => <Story /> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
    defaultPreload: false,
  });
  // @ts-expect-error router type comes from app registry; memory router is fine for stories.
  return <RouterProvider router={router} />;
};

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withRouter],
};

export default preview;