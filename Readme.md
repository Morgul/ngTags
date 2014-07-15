# ngTags

This is a simple directive that adds bootstrap 3 themed tag input.

## Example Usage

Simple include the `.js` and `.css` files, and then add `ui.ngTags` to your app dependencies, like so:

```javascript
angular.module('app', ['ui.ngTags']);
```

Then, where ever you want a tag input, simple do this:

```html
<ng-tags id="exampleTagsInput1" model="tags"></ng-tags>
```

## Options

There are several options that can be specified as attributes on the `ng-tags` element.

### `unique-tags`

* Possible Values: `true` or `false` (Default: `false`)

If `true`, it will only add a tag if it's value is unique.

### `tag-events`

* Possible Values: A list of `'enter'`, `'space'`, and/or `'comma'` (Default: `['enter']`)

Specifies the events that will cause a tag to be created; for example, if `space` is specified, whenever you press
space, it will create a new tag.

### `tag-class`

* Possible Values: `String` or `Function`. (Default: `'label-default'`)

Specifies the class to apply to the tag. Tags always have the bootstrap 3 'label' class applied, however, you can apply
additional classes to override the styling. If `tag-class` is a function, the function will be passed the text of the
tag, and expects a string returned.

### `replace-spaces`

* Possible Values: `true` or `false` (Default: `false`)

If `true` all spaces will be replaces with `-`. This is useful if you are using your tags as slugs, or if you find tags with spaces to be ugly. (_Note: This doesn't make any sense if `space` is specified in `tag-events`._)
