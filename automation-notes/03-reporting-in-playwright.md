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
```

## Allure Report

Allure report can be generated using allure npm package.

Steps to create allure report

- Install `pnpm add -D @playwright/test allure-playwright`
- add this `reporter:[['allure-playwright', {resultsDir:'my-allure-results'}]]` to `playwright.config.js`
- Install `CLI` command to run allure report as `pnpm install -g allure-commandline --save-dev`
- Run test and then run this command `allure generate my-allure-results -o allure-report --clean`
- To open allure report run this `allure open allure-report`
