# File Upload in Playwright

- File Upload in automation testing is possible only on Web Application.
- Playwright can't handle desktop based windows for that we need to use third party tools in seleniu like `autoit` and `robot class`
- In Playwright we directly set file path reference into `<input type='file'/>`

## File Uploads

- Single file upload
- Multiple file upload
- custome file upload

## Single file Uplaod

- Click on file upload input button
- wait for dialog to open
- use `setInputFiles()` method to set file path directly.

```js
await page.locator("#file-btn").click();
await page.locator("file-Upload-box").setInputFiles(["file_relative_path"]);
```

## Multiple file Uplaod

```js
await page.locator("#file-btn").click();
await page
  .locator("file-Upload-box")
  .setInputFiles(["file_relative_path", "another_file.pdf"]);
```

## custome file upload

- for custome file upload use `fileChoose` event listener
- use `setFiles` methods instead of `setInputFiles()`

````js
const fileChooserPromise = page.waitForEvent("fileChooser");
await page.locator("btn").click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles('file_relative_path.pdf');0
```
## Remove set files

Make array as empty.

```js
await page.locator("#file-btn").click();
await page.locator("file-Upload-box").setInputFiles([]);
````

## File Uplaod in Selenium

- sendKeys
- autoIt
- robotclass
- javascript executor for hidden files

<input type='file'>

- I always inspect file upload element and if it is a `type of file` then i use `sendKeys` method.
- If application is not using `input` tag then i use another `third party tools`

```java
WebElement fileUploadBtn = driver.findElement(By.Id("#file-upload-btn"));
fileUploadBtn.sendKeys("file_path.pdf")
```

## Hidden input tag for file upload

<input type='file' style="display:hiddent">

To handle this situation we use javascript executor.

```java
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript(
    "argument[0].style.display='block';",
    uploadElement
)
uploadElement.sendKeys("file_relative_path.pdf")
```

> For multiple file upload in selenium use sendkey with `\n` to seperate file path

## Real Example

```html
<ul id="fileList">
  <li>Test Item 1</li>
  <li>Test Item 2</li>
</ul>
```

Extract text and validate

```js
const listItems = page.loactor("#fileList li");
await expect(listItems).toHaveText('["Test Item 1","Test Item 2"]');
```

### Get li items as individual locator - use `all()` method

```js
const listItems = await page.locator("#fileList li").all();
for (const item of listItems) {
  console.log("locators are", item);
}
```

### extract text into array using `allTextContents()`

```js
const listItems3 = await page.locator("#fileList li").allTextContents();
console.log(listItems3); // Output => ["testing.md","testing2.md"]
```

## Interview Questions

#### Q1: What if the <input type="file"> element is completely hidden or has display: none?

Answer:

- Playwright’s setInputFiles() works perfectly on hidden input elements.
- Unlike Selenium—which might throw an `ElementNotInteractableException`
- Playwright bypasses visibility restrictions for file inputs because it interacts with the browser's lower-level protocols.
- No need to execute custom JavaScript to force the element to become visible.

#### Q2: How do you automate uploading multiple files simultaneously?

Answer:

- Pass an array of string paths to the `setInputFiles()` method, provided the underlying HTML input attribute has the multiple flag enabled.

```js
// Uploading multiple files
await page
  .locator('input[type="file"]')
  .setInputFiles(["path/file1.pg", "path/file2.png"]);
```

#### Q3: Best practice question: How should you store file paths in your framework?

Answer:

- We Never use hardcoded absolute paths (like C:/Users/Name/Documents/file.txt) because they will fail instantly in CI/CD pipelines (like Jenkins or GitHub Actions).
- Always place test files inside a folder within project repository (e.g., a test-data/ folder) and resolve paths relatively using Node's native path module:

```js
import path from "path";

// Resolves dynamically regardless of operating system or machine running it
const filePath = path.resolve(__dirname, "../test-data/sample.pdf");
await page.locator('input[type="file"]').setInputFiles(filePath);
```
