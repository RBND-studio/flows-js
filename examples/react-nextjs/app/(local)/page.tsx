export default function Home() {
  return (
    <main>
      <h2>Home</h2>
      <h3>Flow 1</h3>
      <button id="start-flow-1">Start flow</button>
      <hr />
      <h3>Flow 2</h3>
      <button id="start-flow-2">Start flow</button>
      <hr />
      <h3>Flow 3</h3>
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
