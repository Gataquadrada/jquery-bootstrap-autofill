A (very) simple jQuery + Bootstrap autocomplete plugin, using Boostrap Dropdowns.  
Supports arrows navigation, `Esc` to close and `Enter`/`Return` to confirm.

<br />
<br />

# Summary

-   [Requirements](#requirements)
-   [Usage](#usage)
-   [Localization](#localization)
-   [Options](#options)
-   [Data-Options](#data-options)
-   [Events](#events)
-   [Theming](#theming)
-   [Known issues](#known-issues)
-   [Consider supporting me](#consider-supporting-me)

<br />
<br />

# Requirements

([Back to top](#summary))

This is a jQuery and Bootstrap oriented plugin.  
So, naturally, you'll need [jQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com/).

> NOTE: I believe you would be able to (very easily) adapt this plugin to your needs.

<br />
<br />

# Usage

([Back to top](#summary))

```js
$("SELECTOR").autofill({}) // {} = options
```

<br />
<br />

# Localization

([Back to top](#summary))

You can extend the plugin's `$.fn.autofill.lang` object for translating.

```js
;(function ($) {
    $.fn.autofill.lang = {
        emptyTable: "Nichts zu empfehlen...", // Google translate
        processing: "Wird bearbeitet...", // Google translate
    }
})(jQuery) // encapsulating jQuery is a good practice
```

> NOTE: No RTL support.

<br />
<br />

# Options

([Back to top](#summary))

| Option            | Type          | Default | Description                                                                                       |
| ----------------- | ------------- | ------- | ------------------------------------------------------------------------------------------------- |
| autofillSelection | Boolean       | true    | Fills the `<input>` once a suggestion is picked.                                                  |
| itemsLimit        | Int           | 5       | Limit of items shown.                                                                             |
| datasetURL        | String        | ""      | AJAX URL.                                                                                         |
| datasetMethod     | String        | "GET"   | AJAX method.                                                                                      |
| datasetPostData   | Object        | {}      | Extra data to send during the AJAX call. Automatically adds the `q` key with the `<input>` value. |
| datasetHeaders    | Object        | { }     | Headers to send during the AJAX call.                                                             |
| datasetFormatting | NULL/Function | null    | Used to filtering results of the AJAX call. Useful when using external/custom APIs.               |
| minCharacters     | Int           | 3       | Minimum character length before suggestions are processed.                                        |
| onLoading         | NULL/Function | null    | Triggered before the AJAX call.                                                                   |
| onUpdate          | NULL/Function | null    | Triggered when suggestions are added to the pool.                                                 |
| onSelect          | NULL/Function | null    | Triggered when a suggestion is either clicked or selected with `Enter` or `Return`.               |
| onEmpty           | NULL/Function | null    | Triggered when no suggestions were found.                                                         |
| onError           | NULL/Function | null    | Triggered on AJAX error.                                                                          |
| darkMode          | Boolean       | false   | Adds the `.dropdown-menu-dark` class (native Bootstrap) to the dropdown.                          |
| fullWidth         | Boolean       | true    | Makes the `.dropdown-menu` wull width. Nice for mathcing the `<input>` width.                     |
| values            | Array         | []      | Values to be used.                                                                                |

<br />
<br />

# Data-Options

([Back to top](#summary))

Some options can be added via `data-autofill-` attribute.  
Setting a `data-autofill-` attribute will overwrite the [Options](#options) above.

| Option            | Type    | Default | Description                                      |
| ----------------- | ------- | ------- | ------------------------------------------------ |
| autofillselection | Boolean | true    | Fills the `<input>` once a suggestion is picked. |
| itemslimit        | Int     | 5       | Limit of items shown.                            |
| dataseturl        | String  | ""      | AJAX URL.                                        |
| datasetmethod     | String  | "GET"   | AJAX method.                                     |
| values            | String  | ""      | Values to be used. Separated by `\|`.            |

<br />
<br />

# Events

([Back to top](#summary))

| Option            | Description                                                                         |
| ----------------- | ----------------------------------------------------------------------------------- |
| autofill-loading  | Triggered before the AJAX call.                                                     |
| autofill-update   | Triggered when suggestions are added to the pool.                                   |
| autofill-selected | Triggered when a suggestion is either clicked or selected with `Enter` or `Return`. |
| autofill-empty    | Triggered when no suggestions were found.                                           |
| autofill-error    | Triggered on AJAX error.                                                            |

<br />
<br />

# Theming

([Back to top](#summary))

-   📃 The `<ul>` element has a (hopefully) unique `.autofill-dropdown-menu` class.
-   🔤 The `<input>` element has a (hopefully) unique `.autofill-input` class.

<br />
<br />

# Known issues

([Back to top](#summary))

-   🙅🏼‍♀️ Not fully tested.
-   🐛 Weird behavior when using `.disabled` elements and arrows navigation.
-   🐭 If you try to be funny, by clicking and pressing `Enter`/`Return` at the same time, your mouse will take priority.
-   🌇 I made this in a couple hours and to fulfill personal needs. Expect the unexpected.

<br />
<br />

# Consider supporting me

([Back to top](#summary))

-   [Buy me a coffee](https://www.buymeacoffee.com/mazeakin)
-   [Follow me on Twitter](https://twitter.com/mazeakin)
-   [Follow me on Twitch](https://twitch.tv/mazeakin)
-   [Join my Discord](https://discord.gg/eYfSNQT)
-   [Get sub emotes on my old channel](https://twitch.tv/gataquadrada)
