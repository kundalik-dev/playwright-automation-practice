# Reporting in Playwright

Playwright has different built in reports

- List => simple list in command line
- Dot => ..F
- html => html report is created
- line => 4 passed
- json
- junit
- github actions
- custome reports
  - allure
  - monocart
  - tesults
  - current JS
  - serenity JS

## Report configuration

For config any report we need to add `report type` inside `playwrigh.config.js` file as shown below. Or we can run any report by passing argument in `CLI` as `npx playwright test --report=list`

```js
// playwright.config.js
reporter: "list";

// for multiple report to generate
reporter: [["list"], ["dot"], ["html"]];

// reporter configuration settings
reporter: [
  // 1. Your customized HTML reporter
  [
    "html",
    {
      open: "never",
      outputFolder: "my-html-report",
      port: 3000,
    },
  ],
  // 2. Terminal-based live logging
  ["list"],
  // 3. JSON Reporter (Requires 'outputFile')
  ["json", { outputFile: "results/test-run.json" }],
  // 4. JUnit XML Reporter for CI/CD gates (Requires 'outputFile')
  ["junit", { outputFile: "results/junit.xml" }],
];
```

### configuration options are

- Open: "always" | "never" | "on-failure"
- host: 8080
- outputFolder: "folder_name"
- outputFile:"results/test-run.json"

## Allure Report

Allure report can be generated using allure npm package.

Steps to create allure report

- Install `pnpm add -D @playwright/test allure-playwright`
- add this `reporter:[['allure-playwright', {resultsDir:'my-allure-results'}]]` to `playwright.config.js`
- Install `CLI` command to run allure report as `pnpm install -g allure-commandline --save-dev`
- Run test and then run this command `allure generate my-allure-results -o allure-report --clean`
- To open allure report run this `allure open allure-report`
