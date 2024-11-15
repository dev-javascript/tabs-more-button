# tabs-more-button

[![Test coverage](https://codecov.io/gh/dev-javascript/tabs-more-button/graph/badge.svg?token=GT1LU074L2)](https://codecov.io/gh/dev-javascript/tabs-more-button) [![NPM version](http://img.shields.io/npm/v/tabs-more-button.svg?style=flat-square)](http://npmjs.org/package/tabs-more-button) [![License](http://img.shields.io/npm/l/tabs-more-button.svg?style=flat-square)](LICENSE) [![npm download](https://img.shields.io/npm/dm/tabs-more-button.svg?style=flat-square)](https://npmjs.org/package/tabs-more-button) [![Build Status](https://travis-ci.org/ly-components/tabs-more-button.png)](https://travis-ci.org/ly-components/tabs-more-button)

`tabs-more-button` is a lightweight library designed to enhance your tabbed interfaces by making them responsive.​ This package does not create or manage tabs, but it intelligently hides overflow tabs while ensuring that the active tab remains visible. Ideal for scenarios where space is limited

## Features

- Responsive

- `Vertical` support

- `rtl` support

- Flexible style

- High performance

## Installation

> $ npm install tabs-more-button --save

or

> $ yarn add tabs-more-button

If you need to directly include script in your html, use the following links :

```js
<script src="https://unpkg.com/tabs-more-button@latest/dist/tabs-more-button.min.js"></script>
```

## Minimal Usage

html :

```html
<div id="container">
  <ul id="tablist" style="display:inline-flex;">
    <li>Tab 0</li>
    <li>Tab 1</li>
    <li>Tab 2</li>
    <li>Tab 3</li>
    <li style="color:red;">Active Tab 4</li>
    <li>Tab 5</li>
    <li>Tab 6</li>
  </ul>
  <button id="view-more-button">more</button>
</div>
```

js :

```js
import tabsMoreButton from 'tabs-more-button';

const options = {
  buttonElement: document.getElementById('view-more-button'),
  containerElement: document.getElementById('container'),
  tablistElement: document.getElementById('tablist'),
};
const instance = new tabsMoreButton(options);

let hiddenTabs = instance.resize(4 /*selectedTabIndex*/);
addEventListener('resize', () => {
  hiddenTabs = instance.resize(4 /*selectedTabIndex*/);
});
document.getElementById('view-more-button').addEventListener('click', () => console.table(hiddenTabs));
```

## Rules

- `view more` button is required to display the hidden tabs and should be next sibling element of `Tablist` element

- `tabs` and `view more` button should be kept on same line

- Should not be any gap between `view more` button and `Tablist`

## options

- buttonElement

  - type : `HtmlELement`
  - description : `view more` button

- containerElement

  - type : `HtmlELement`
  - description : parent element of `view more` button and `Tablist` element

- tablistElement

  - type : `HtmlELement`
  - description : the `Tablist` element

- tabDisplay?

  - type : `string`
  - description : `display` value for each `tab` element
  - default value : `inline-flex`

- containerDisplay?

  - type : `"flex"`|`"block"`
  - description : `display` value for `containerElement`
  - default value : `flex`

## instance methods

- resize

  - type : `function`
  - description : makes tabs responsive by hiding `overflow tabs` except `active tab`
  - arguments :
    - selectedTabIndex :
      - type : `Number`
      - description : index of active tab element in the tablist element
    - direction? :
      - type : `"ltr" | "rtl"`
      - description : direction value of `tablist` element
      - default value : `"ltr"`
    - isVertical? :
      - type : `Boolean`
      - description : `true` means `tablist` element is vertical
      - default value : `false`
  - return :
    - type : `Array<{ el: HTMLElement, index: Number }>`
    - description : array of hidden tabs data

## Test

> $ npm run test

## License

MIT
