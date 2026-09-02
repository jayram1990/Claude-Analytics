(function() {
    let template = document.createElement("template");
    template.innerHTML = `
        <style>
            :host { display: block; padding: 1em; font-family: Arial, sans-serif; color: #333; }
            .section { margin-bottom: 16px; }
            label { display: block; font-size: 12px; font-weight: bold; margin-bottom: 6px; color: #475569; }
            input, select { width: 100%; box-sizing: border-box; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; }
            input:focus, select:focus { border-color: #2563eb; outline: none; }
            .hint { font-size: 11px; color: #64748b; margin-top: 4px; font-style: italic; line-height: 1.5; }
            .hint code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-style: normal; font-size: 11px; }
            .hint strong { color: #0f172a; font-style: normal; }
            optgroup { font-weight: bold; color: #374151; }
        </style>

        <div class="section">
            <label>Header Component Label</label>
            <input type="text" id="aps_headerLabel" />
        </div>

        <div class="section">
            <label>AI Model</label>
            <select id="aps_model">
                <optgroup label="── Anthropic API (Direct) ──">
                    <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 — Fast &amp; Low Cost</option>
                    <option value="claude-sonnet-4-6">Claude Sonnet 4.6 — Balanced</option>
                    <option value="claude-opus-4-8">Claude Opus 4.8 — Most Capable</option>
                </optgroup>
                <optgroup label="── OpenRouter — Free Tier ──">
                    <option value="anthropic/claude-3-haiku:free">Claude 3 Haiku — FREE (OpenRouter)</option>
                    <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B — FREE (OpenRouter)</option>
                    <option value="mistralai/mistral-7b-instruct:free">Mistral 7B — FREE (OpenRouter)</option>
                    <option value="google/gemma-2-9b-it:free">Gemma 2 9B — FREE (OpenRouter)</option>
                </optgroup>
                <optgroup label="── OpenRouter — Paid ──">
                    <option value="anthropic/claude-sonnet-4-5">Claude Sonnet 4.5 (OpenRouter)</option>
                    <option value="anthropic/claude-opus-4">Claude Opus 4 (OpenRouter)</option>
                </optgroup>
            </select>
            <div class="hint">
                <strong>Anthropic API models:</strong> use <code>https://api.anthropic.com/v1/messages</code> as URL.<br>
                <strong>OpenRouter models:</strong> use <code>https://openrouter.ai/api/v1/chat/completions</code> as URL.
            </div>
        </div>

        <div class="section">
            <label>Proxy / API URL</label>
            <input type="text" id="aps_apiUrl" placeholder="Paste your endpoint URL here" />
            <div class="hint">
                <strong>Anthropic direct:</strong> <code>https://api.anthropic.com/v1/messages</code><br>
                <strong>OpenRouter (free models):</strong> <code>https://openrouter.ai/api/v1/chat/completions</code><br>
                Get a free OpenRouter key at <strong>openrouter.ai/keys</strong> — no credit card required for free-tier models.
            </div>
        </div>

        <div class="section">
            <label>API Key</label>
            <input type="password" id="aps_apiKey" placeholder="sk-ant-... or sk-or-..." />
            <div class="hint">
                <strong>Anthropic:</strong> get key at <strong>console.anthropic.com</strong><br>
                <strong>OpenRouter:</strong> get free key at <strong>openrouter.ai/keys</strong> — free models have no cost.
            </div>
        </div>

        <div class="section">
            <label>Initial Greeting / Welcome Message</label>
            <input type="text" id="aps_welcomeMsg" />
        </div>

        <div class="section">
            <label>Creativity (Temperature)</label>
            <input type="number" id="aps_temperature" min="0" max="1" step="0.1" />
            <div class="hint">0.0 = Precise/Deterministic &nbsp;|&nbsp; 1.0 = Highly Creative. Recommended: 0.2 for analytics.</div>
        </div>

        <div class="section">
            <label>Max Tokens</label>
            <input type="number" id="aps_maxTokens" min="10" max="4000" />
            <div class="hint">Controls response length. 1000 is a good default. Free tier models may cap at 4096.</div>
        </div>
    `;

    class ClaudePropertyBuilderPanel extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            this._props = {};

            this.bindEvent("aps_headerLabel", "headerLabel");
            this.bindEvent("aps_model",       "model");
            this.bindEvent("aps_welcomeMsg",  "welcomeMsg");
            this.bindEvent("aps_temperature", "temperature", true);
            this.bindEvent("aps_maxTokens",   "maxTokens",   true);
            this.bindEvent("aps_apiUrl",      "apiUrl");
            this.bindEvent("aps_apiKey",      "apiKey");
        }

        bindEvent(domId, propName, isNumeric = false) {
            const element = this._shadowRoot.getElementById(domId);
            element.addEventListener("change", () => {
                let val = element.value;
                if (isNumeric) val = parseFloat(val);
                this._props[propName] = val;
                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                    detail: { properties: { [propName]: val } }
                }));
            });
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            if (this._props.headerLabel !== undefined) this._shadowRoot.getElementById("aps_headerLabel").value = this._props.headerLabel;
            if (this._props.model       !== undefined) this._shadowRoot.getElementById("aps_model").value       = this._props.model;
            if (this._props.welcomeMsg  !== undefined) this._shadowRoot.getElementById("aps_welcomeMsg").value  = this._props.welcomeMsg;
            if (this._props.temperature !== undefined) this._shadowRoot.getElementById("aps_temperature").value = this._props.temperature;
            if (this._props.maxTokens   !== undefined) this._shadowRoot.getElementById("aps_maxTokens").value   = this._props.maxTokens;
            if (this._props.apiUrl      !== undefined) this._shadowRoot.getElementById("aps_apiUrl").value      = this._props.apiUrl;
            if (this._props.apiKey      !== undefined) this._shadowRoot.getElementById("aps_apiKey").value      = this._props.apiKey;
        }
    }

    customElements.define("com-custom-sap-claude-aps", ClaudePropertyBuilderPanel);
})();
