export default function HomePage() {
  return (
    <main>
      <div className="header">
        <div className="header-inner-wrap">
          <div className="callout">
            <h1>Flows React Next.js example</h1>
            <p>
              Get started at&nbsp;
              <a
                href="https://flows.sh/?utm_source=demos&utm_campaign=next-js"
                target="_blank"
                className="link"
              >
                flows.sh
              </a>
            </p>
          </div>
          <a
            href="https://flows.sh/?utm_source=demos&utm_campaign=next-js"
            target="_blank"
            className="logo"
          >
            <img src="/logo.svg" alt="FlowsJS" height="36" />
          </a>
        </div>
      </div>
      <div className="main-wrapper">
        <div className="flows-launch-wrapper">
          <button id="start-cloud">Launch Cloud flow</button>
          <button id="start-local">Launch Local flow</button>
        </div>
        <div className="app-wrapper">
          <div className="app-header">
            <p className="app-logo">DropCrate</p>
            <button className="btn-secondary" id="upload">
              Upload file
            </button>
          </div>
          <div className="app-content">
            <p className="app-list-title">Your files</p>
            <div className="app-files">
              <div className="app-file-item" id="file1">
                File 1
              </div>
              <div className="app-file-item" id="file2">
                File 2
              </div>
              <div className="app-file-item" id="file3">
                File 3
              </div>
              <div className="app-file-item" id="file4">
                File 4
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-inner-wrap">
          <a
            className="footer-link"
            href="https://flows.sh/docs/?utm_source=demos&utm_campaign=next-js"
            target="_blank"
          >
            <h2 className="footer-heading">Docs</h2>
            <p className="footer-link-text">Learn how to use Flows to build user onboarding.</p>
          </a>
          <a
            className="footer-link"
            href="https://app.flows.sh/signup/?utm_source=demos&utm_campaign=next-js"
            target="_blank"
          >
            <h2 className="footer-heading">Sign up</h2>
            <p className="footer-link-text">Create a Flows account and start creating flows.</p>
          </a>
          <a
            className="footer-link"
            href="https://github.com/RBND-studio/flows-js/tree/main/examples"
            target="_blank"
          >
            <h2 className="footer-heading">See other demos</h2>
            <p className="footer-link-text">Visit our GitHub repo to see other examples.</p>
          </a>
          <a
            className="footer-link"
            href="https://github.com/RBND-studio/flows-js/tree/main/examples/react-nextjs"
            target="_blank"
          >
            <h2 className="footer-heading">See source code</h2>
            <p className="footer-link-text">
              Visit our GitHub repo to what makes this example tick.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
