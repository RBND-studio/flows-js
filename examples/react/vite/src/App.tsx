import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { FlowsProvider, FlowsSlot } from "@flows/react";
import * as components from "@flows/react-components";
import * as tourComponents from "@flows/react-components/tour";
import "@flows/react-components/index.css";
import { Banner } from "./components/banner";
import { TourBanner } from "./components/tour-banner";

function App() {
  const [count, setCount] = useState(0);

  return (
    <FlowsProvider
      organizationId="YOUR_ORGANIZATION_ID"
      userId="YOUR_USER_ID"
      environment="production"
      components={{
        ...components,
        Banner: Banner,
      }}
      tourComponents={{
        ...tourComponents,
        Banner: TourBanner,
      }}
    >
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <FlowsSlot
        id="my-slot"
        placeholder={
          <div>
            <p>Slot content will be displayed here</p>
          </div>
        }
      />

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </FlowsProvider>
  );
}

export default App;
