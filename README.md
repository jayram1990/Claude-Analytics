# Claude Enterprise Assistant — SAP Analytics Cloud Custom Widget

A custom SAC widget that embeds Claude AI directly into your analytics canvas, enabling natural-language conversation over live table data.

---

## Files

| File | Purpose |
|---|---|
| `ClaudeWidget.js` | Main runtime widget (chat UI, API calls, SAC context) |
| `aps_claude.js` | Builder/styling panel (property controls shown in SAC designer) |
| `claude_aps.json` | Widget manifest — registers the widget with SAC |

---

## Features

- Chat with Claude about data loaded from any SAC table/chart
- Supports **Anthropic API** (direct) and **OpenRouter** (including free-tier models)
- Provider badge in header shows which API is active
- Conversation history preserved across messages in a session
- Input disabled until both API URL and key are configured
- Auto-converts Anthropic model IDs to OpenRouter format when needed

---

## Quick Start

### Option A — Free via OpenRouter (no credit card)

1. Create a free key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. In the SAC styling panel configure:
   - **API URL** → `https://openrouter.ai/api/v1/chat/completions`
   - **API Key** → your `sk-or-...` key
   - **Model** → `Claude 3 Haiku — FREE (OpenRouter)`

### Option B — Anthropic API (paid, higher limits)

1. Get a key at [console.anthropic.com](https://console.anthropic.com)
2. In the SAC styling panel configure:
   - **API URL** → `https://api.anthropic.com/v1/messages`
   - **API Key** → your `sk-ant-...` key
   - **Model** → any model under the `Anthropic API (Direct)` group

---

## Deploying to SAC

1. Host the three files on a publicly accessible URL (e.g. GitHub Pages, Azure Blob, S3).
2. Update the `url` fields in `claude_aps.json` to point to your hosted files:
   ```json
   "webcomponents": [
     { "kind": "main",    "url": "https://jayram1990.github.io/Claude-Analytics/ClaudeWidget.js" },
     { "kind": "styling", "url": "https://jayram1990.github.io/Claude-Analytics/aps_claude.js" }
   ]
   ```
3. In SAC → **Analytics Designer** → **Custom Widgets** → upload `claude_aps.json`.
4. Drag the widget onto your canvas.
5. Open the styling panel and fill in API URL, API Key, and select a model.

### Passing table data to the widget

In your canvas script, call `setTableData` with a string representation of your data:

```javascript
var widget = Application.getWidget("ClaudeChat_1");
var data = dataSource.getDataAsString(); // your SAC data source
widget.setTableData(data);
```

This loads the data into Claude's context window and enables the chat input.

---

## Model Reference

### Anthropic API — `https://api.anthropic.com/v1/messages`

| Model ID | Notes |
|---|---|
| `claude-haiku-4-5-20251001` | Fastest, lowest cost — good default for analytics |
| `claude-sonnet-4-6` | Balanced quality and speed |
| `claude-opus-4-8` | Most capable, highest cost |

### OpenRouter — `https://openrouter.ai/api/v1/chat/completions`

| Model ID | Cost |
|---|---|
| `anthropic/claude-3-haiku:free` | Free |
| `meta-llama/llama-3.1-8b-instruct:free` | Free |
| `mistralai/mistral-7b-instruct:free` | Free |
| `google/gemma-2-9b-it:free` | Free |
| `anthropic/claude-sonnet-4-5` | Paid |
| `anthropic/claude-opus-4` | Paid |

> Free-tier models on OpenRouter have rate limits but no cost. Claude 3 Haiku (free) is the recommended starting model for analytics workloads.

---

## Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `headerLabel` | string | `"Claude Analytics"` | Title shown in the widget header |
| `model` | string | `claude-haiku-4-5-20251001` | Model ID (Anthropic or OpenRouter format) |
| `apiUrl` | string | — | API endpoint URL |
| `apiKey` | string | — | API key for the selected provider |
| `welcomeMsg` | string | — | Greeting shown on first load |
| `temperature` | number | `0.2` | Creativity: 0.0 = precise, 1.0 = creative |
| `maxTokens` | number | `1000` | Maximum tokens in each response |
| `metadata` | string | — | Internal SAC layout metadata (auto-managed) |

---

## Methods

| Method | Parameters | Description |
|---|---|---|
| `setTableData(jsonData)` | `string` | Loads data string into Claude's context; enables the chat input |
| `setHeaderLabel(value)` | `string` | Dynamically updates the header title |
| `getHeaderLabel()` | — | Returns the current header title |

---

## Architecture

```
SAC Canvas
  └── ClaudeWidget (com-custom-sap-claude)
        ├── Shadow DOM chat UI
        ├── conversationHistory[]   — multi-turn message array
        ├── sacContextData          — table data injected via setTableData()
        └── executePrompt()
              ├── Detects provider from apiUrl
              │     ├── anthropic.com  → Anthropic Messages API format
              │     └── openrouter.ai  → OpenAI-compatible format
              └── Auto-converts model IDs between providers
```

---

## Version History

| Version | Notes |
|---|---|
| 1.1.0 | Added free-tier OpenRouter models; fixed model selection bug for OpenRouter; added provider badge; input disabled until configured |
| 1.0.3 | Initial dual-provider support (Anthropic + OpenRouter) |

---

## License

MIT
