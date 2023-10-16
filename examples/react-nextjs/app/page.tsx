export default function Home() {
  return (
    <main>
      <h1>Vanilla JS example - Flows JS</h1>
      <h2>Flow 1</h2>
      <button id="start-flow-1">Start flow</button>
      <hr />
      <h2>Flow 2</h2>
      <button id="start-flow-2">Start flow</button>
      <div>
        <br />
        <span className="flow-2-text">Text</span>
      </div>
      <br />
      <button id="continue-flow-2">Continue</button>
      <hr />
      <h2>Flow 3</h2>
      <button id="start-flow-3">Start flow</button>
      <button id="flow-3-A">Variant A</button>
      <button id="flow-3-B">Variant B</button>
      <div>
        <br />
        <span className="flow-3-A-text">Variant A text</span>
      </div>
      <div>
        <br />
        <span className="flow-3-B-text">Variant B text</span>
      </div>
      <div>
        <br />
        <span className="flow-3-final">This is final step</span>
      </div>
    </main>
  );
}
