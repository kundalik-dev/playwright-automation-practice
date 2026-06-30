# Video and trace in playwright

- Video and trace can be recorded in playwrigh using `playwright.config.js` file

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  use: {
    video: "on",
    trace: "on",
  },
});
```

## Video config options

- `off`: Do not record video.
- `on`: Record and keep a video for every run.
- `on-first-retry`: Record and keep a video only for the first retry of a test.
- `on-all-retries`: Record and keep a video for every retry.
- `retain-on-failure`: Record a video for every run, but keep it only for runs that failed. A failed run's video is kept even when a later retry passes.
- `retain-on-first-failure`: Record a video only for the first run of a test (not for retries), and keep it only if that run failed.
- `retain-on-failure-and-retries`: Record a video for every run, and keep it for any run that failed or that is a retry.

```js
video?: VideoMode | "retry-with-video" | {
    mode: VideoMode;
    size?: ViewportSize;
    show?: {
        actions?: {
            duration?: number;
            position?: "top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right";
            fontSize?: number;
        };
        test?: {
            level?: "file" | "title" | "step";
            position?: "top-left" | "top" | "top-right" | "bottom-left" | "bottom" | "bottom-right";
            fontSize?: number;
        };
    };
} | undefined
```

### Video object terms

| Term                   | Type                          | What it means                                                       |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------- |
| `video?`               | optional                      | The whole video setting; can be omitted (`undefined`)               |
| `VideoMode`            | string union                  | The basic mode value (`"off"`, `"on"`, `"retain-on-failure"`, etc.) |
| `"retry-with-video"`   | literal string                | Legacy shorthand: record only when a test is retried                |
| `{ mode, size, show }` | object form                   | Advanced config when you need more than a simple mode string        |
| `mode`                 | `VideoMode`                   | Required inside the object — same modes as above                    |
| `size?`                | `ViewportSize`                | Optional video resolution, e.g. `{ width, height }`                 |
| `show?`                | object                        | Optional overlays drawn on top of the recorded video                |
| `show.actions?`        | object                        | Visual labels for each Playwright **action** (click, fill…)         |
| `actions.duration?`    | `number`                      | How long (ms) each action label stays visible                       |
| `actions.position?`    | string union                  | Where the action label sits (`"top-left"` … `"bottom-right"`)       |
| `actions.fontSize?`    | `number`                      | Font size of the action label                                       |
| `show.test?`           | object                        | Visual label showing **test** info on the video                     |
| `test.level?`          | `"file" \| "title" \| "step"` | How much test detail to display                                     |
| `test.position?`       | string union                  | Where the test label sits (same 6 positions)                        |
| `test.fontSize?`       | `number`                      | Font size of the test label                                         |
| `undefined`            | —                             | Allowed value — feature turned off                                  |

> **Note:** `?` after a key = the property is **optional**. `|` = a **union** (value can be any one of the listed options). The 6 position values are: `top-left`, `top`, `top-right`, `bottom-left`, `bottom`, `bottom-right`.

## Trace Mode

Whether to record trace for each test. Defaults to 'off'. The initial run of a test is the "first run"; subsequent runs caused by retries are "retries".

```js
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    trace: "on-first-retry",
  },
});
```

- `off`: Do not record trace.
- `on`: Record and keep a trace for every run.
- `on-first-retry`: Record and keep a trace only for the first retry of a test.
- `on-all-retries`: Record and keep a trace for every retry.
- `retain-on-failure`: Record a trace for every run, but keep it only for runs that failed. A failed run's trace is kept even when a later retry passes
- `retain-on-first-failure`: Record a trace only for the first run of a test (not for retries), and keep it only if that run failed.
- `retain-on-failure-and-retries`: Record a trace for every run, and keep it for any run that failed or that is a retry.

```js
(property) trace?: TraceMode | "retry-with-trace" | {
    mode: TraceMode;
    snapshots?: boolean;
    screenshots?: boolean;
    sources?: boolean;
    attachments?: boolean;
} | undefined
```

### Trace object terms

| Term                 | Type            | What it means                                                       |
| -------------------- | --------------- | ------------------------------------------------------------------- |
| `trace?`             | optional        | The whole trace setting; can be omitted (`undefined`)               |
| `TraceMode`          | string union    | The basic mode value (`"off"`, `"on"`, `"on-first-retry"`, etc.)    |
| `"retry-with-trace"` | literal string  | Legacy shorthand: record only when a test is retried                |
| `{ mode, ... }`      | object form     | Advanced config when you need more than a simple mode string        |
| `mode`               | `TraceMode`     | Required inside the object — same modes as above                    |
| `snapshots?`         | `boolean`       | Capture DOM snapshots for time-travel debugging                     |
| `screenshots?`       | `boolean`       | Capture screenshots into the trace timeline                         |
| `sources?`           | `boolean`       | Include your test source code in the trace                          |
| `attachments?`       | `boolean`       | Include attachments (e.g. uploaded files) in the trace              |
| `undefined`          | —               | Allowed value — feature turned off                                  |
