# getByRole Locator

Ways to find roles

- aria-label
- aria-labelledby
- label & nested label text
- inner text / sub-elements (Buttons, links, headers)
- placeholder
- title attribute

```js
await page.getByRole("role", { name: "role-value" });
```

- role => can be button, textbox, link etc.
- name => name value findings methods mentioned above
