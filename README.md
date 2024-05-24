# tabs-more-button

Responsive Tabs with more button

Making tabs responsive by hiding overflow tabs except active tab

## Installation

```js
$ npm install tabs-more-button --save
```

or

```js
$ yarn add tabs-more-button
```

If you need to directly include script in your html, use the following links :

```js
<script src="https://unpkg.com/tabs-more-button@latest/dist/tabs-more-button.min.js"></script>
```

## Usage

html :

```js
<div id="container" style="display:flex;">
  <ul style="display:inline-flex;">
    <li style="display:inline-flex;">Tab 0</li>
    <li style="display:inline-flex;">Tab 1</li>
    <li style="display:inline-flex;">Tab 2</li>
    <li style="display:inline-flex;">Tab 3</li>
    <li style="display:inline-flex;color:red;">Active Tab 4</li>
    <li style="display:inline-flex;">Tab 5</li>
    <li style="display:inline-flex;">Tab 6</li>
  </ul>
  <button id="more-button" style="display:inline-flex;">
    more
  </button>
</div>
```

js :

```js
import tabsMoreButton from 'tabs-more-button';

const options = {
  buttonElement: document.getElementById('more-button'),
  containerElement: document.getElementById('container'),
};
const instance = new tabsMoreButton(options);

let hiddenTabs = instance.resize(4 /*selectedTabIndex*/);
addEventListener('resize', () => {
  hiddenTabs = instance.resize(4 /*selectedTabIndex*/);
});
document.getElementById('more-button').addEventListener('click', () => console.table(hiddenTabs));
```

## options

- buttonElement

  - type : `HtmlELement`
  - description : `view more` button (should be next sibling element of `Tablist` element)

- containerElement

  - type : `HtmlELement`
  - description : the first ancestor of `buttonElement` which its `width|height` is not relative to `tab list` element but is relative to `viewport`

- tabDisplay?

  - type : `string`
  - description : `display` value for each `tab` element
  - default value : `inline-flex`

- containerDisplay?

  - type : `string`
  - description : `display` value for `containerElement`
  - default value : `flex`

## instance methods

- resize

  - type : `function`
  - description : makes tabs responsive by hiding `overflow tabs` except `active tab`
  - arguments :
    1. selectedTabIndex :
       - type : `Number`
       - description : index of active tab element in the tablist element
    2. direction? :
       - type : `"ltr" | "rtl"`
       - description : direction value of `tablist` element
       - default value : `"ltr"`
    3. isVertical? :
       - type : `Boolean`
       - description : `true` means `tablist` element is vertical
       - default value : `false`
  - return :
    - type : `Array<{ el: HTMLElement, index: Number }>`
    - description : array of hidden tabs data
