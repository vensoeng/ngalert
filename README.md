# NG Alert

NG Alert is a library created to facilitate the creation of Popup Messages or Notifications for display to users (User Interaction) on websites.

- **Zero dependencies** — pure vanilla JavaScript
- **Accessible** — `role="alertdialog"`, `aria-labelledby`, `aria-describedby`, focus management, keyboard dismiss
- **4 types** — `success`, `error`, `warning`, `info`
- **Auto-dismiss** with animated progress bar
- **Customizable** — duration, labels, overlay/ESC close behavior
- **~4 KB** total (JS + CSS)

---

## Installation

### CDN (easiest)

```html
<link rel="stylesheet" href="https://vensoeng.vercel.app/ngalert@0.1.0/dic/ngalert.css">
<script src="https://vensoeng.vercel.app/ngalert@0.1.0/dic/ngalert.js"></script>
```

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="dist/ngalert.css">
</head>
<body>
  <button onclick="NGAlert.success('Your file was saved!')">Show Alert</button>
  <script src="dist/ngalert.js"></script>
</body>
</html>
```

---

## Usage

### Shorthand methods

```js
NGAlert.success('Your changes have been saved on NG Alert.');
NGAlert.error('Something went wrong. Please try NG Alert again.');
NGAlert.warning('Your session is about to expire Contact NG Alert for get APIKEY.');
NGAlert.info('A new version of NG Alert is available.');
```

### With custom title and options

```js
NGAlert.success('Invoice #1042 has been sent.', {
  title: 'Email Sent',
  duration: 4000
});
```

### Generic `show()`

```js
NGAlert.show('Message text', 'success', { title: 'Done', duration: 3000 });
```

### Dismiss programmatically

```js
const alert = NGAlert.info('Loading…', { duration: 0 }); // duration:0 stays open
// later...
alert.dismiss();
// or dismiss whatever is currently shown:
NGAlert.dismiss();
```

---

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | type label | Title shown in the alert |
| `duration` | `number` | `5000` | Auto-dismiss delay in ms. Use `0` to disable |
| `closeOnOverlay` | `boolean` | `true` | Click backdrop to close |
| `closeOnEsc` | `boolean` | `true` | Press Escape to close |

---

## Global Config

Set defaults once at app startup:

```js
NGAlert.init({
  duration: 4000,
  closeOnOverlay: false,
  labels: {
    success: 'Done',
    error: 'Oops',
    warning: 'Heads Up',
    info: 'FYI'
  }
});
```

---

## Return Value

Every `show()` / shorthand call returns an instance object:

```js
const instance = NGAlert.success('Hello world!');
instance.dismiss();    // close it early
instance.element;      // the root DOM element
```

---

## CSS Custom Properties

Override these in your own CSS to theme the library:

```css
:root {
  --nga-z-index:       9999;
  --nga-overlay:       rgba(13, 17, 23, 0.36);
  --nga-panel-bg:      #ffffff;
  --nga-panel-text:    #1f2937;
  --nga-panel-subtext: #4b5563;
  --nga-shadow:        0 24px 56px rgba(2, 8, 23, 0.22);
  --nga-radius:        16px;
  --nga-success:       #10b981;
  --nga-error:         #ef4444;
  --nga-warning:       #f59e0b;
  --nga-info:          #0ea5e9;
  --nga-bg-success:    #eefaf6;
  --nga-bg-error:      #ffeded;
  --nga-bg-warning:    #fff9ed;
  --nga-bg-info:       #e8f6ff;
  --nga-font: "Google Sans", sans-serif;
}
```

---

## API Reference

```js
NGAlert.version          // "0.1.0"
NGAlert.init(config)     // set global defaults
NGAlert.show(msg, type, options)
NGAlert.success(msg, options)
NGAlert.error(msg, options)
NGAlert.warning(msg, options)
NGAlert.info(msg, options)
NGAlert.dismiss()        // dismiss the current alert
```

Both `NGAlert` and `ngAlert` are available as global variables.

---

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge). No IE11 support.

---

## License

[MIT](LICENSE)
