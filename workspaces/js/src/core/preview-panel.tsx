import { version } from "../lib/version";
import { type FlowState } from "./flow-state";
import { type FlowsContext } from "./flows-context";
import { startFlow } from "./public-methods";

export class PreviewPanel {
  flowId: string;
  rootElement?: HTMLElement;
  placement: "top" | "bottom" = "bottom";

  flowsContext: FlowsContext;

  constructor({ context, flowId }: { context: FlowsContext; flowId: string }) {
    this.flowId = flowId;
    this.flowsContext = context;
    this.render();
  }

  get flowState(): FlowState | undefined {
    return this.flowsContext.instances.get(this.flowId);
  }

  resetFlow(): void {
    if (this.flowState) this.flowState.destroy();
    startFlow(this.flowId, { startDraft: true });
  }

  loadStyle(): void {
    const id = "flows-panel-styles";
    if (document.querySelector(`#${id}`)) return;
    const href = `https://cdn.jsdelivr.net/npm/@flows/js@${version}/css.min/panel.css`;
    const styleEl = <link id={id} rel="stylesheet" href={href} />;
    document.head.appendChild(styleEl);
  }

  render(): void {
    this.loadStyle();
    this.unmount();

    const projectId = this.flowsContext.projectId;
    if (!projectId) return;

    const wrapperClassNames = ["flows-preview-panel"];
    if (this.placement === "top") wrapperClassNames.push("flows-panel-top");
    if (this.placement === "bottom") wrapperClassNames.push("flows-panel-bottom");

    this.rootElement = (
      <div className={wrapperClassNames.join(" ")}>
        <div className="flows-panel-main">
          <p>
            Flows preview: <code>{this.flowId}</code>
          </p>
          <div className="flows-panel-buttons">
            <button className="flows-panel-btn flows-preview-reset">Reset</button>
            <a
              className="flows-panel-btn"
              href={`https://app.flows.sh/project/${projectId}/flow/${this.flowId}/edit`}
              target="_blank"
            >
              Edit flow
            </a>
          </div>
        </div>
        <div className="flows-panel-buttons">
          <button className="flows-panel-btn flows-panel-btn-icon flows-panel-placement">
            <span className={this.placement === "top" ? "flows-arrow-down" : "flows-arrow-up"} />
          </button>
          <button className="flows-panel-btn flows-panel-btn-icon flows-panel-close">
            <span className="flows-x" />
          </button>
        </div>
      </div>
    );

    document.body.appendChild(this.rootElement);
  }

  togglePlacement(): void {
    this.placement = this.placement === "top" ? "bottom" : "top";
    this.render();
  }

  unmount(): void {
    this.rootElement?.remove();
  }

  close(): void {
    this.unmount();
    this.flowsContext.previewPanel = null;
  }
}
