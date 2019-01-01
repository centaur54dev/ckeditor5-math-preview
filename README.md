# ckeditor5-math-preview
## About
This is a plugin for [ckeditor 5](https://github.com/ckeditor/ckeditor5). When clicking on a latex math expression, a popup is shown that displays the expression rendered with MathJax or katex. 

UPDATE: katex rendering added
UPDATE: working with ckeditor5 version 11.2.0 (ckeditor5-engine v.12.0).

## Install
Install using NPM: 

`npm install ckeditor5-math-preview`

To add the functionality of this plugin you should make a custom build of the editor. Follow the instructions [here](https://docs.ckeditor.com/ckeditor5/latest/builds/guides/development/installing-plugins.html).


To load the plugin, configure ckeditor (e.g. edit file `ckeditor.js`) like this:

#### Import plugin
```
import MathpreviewPlugin from 'ckeditor5-math-preview/src/mathpreview';
```


#### Configure plugin
Assuming that the build is based on Classic Editor:

```
export default class ClassicEditor extends ClassicEditorBase {}

	// Plugins to include in the build.
	ClassicEditor.builtinPlugins = [
		...
		MathpreviewPlugin,
		...
	],

	ClassicEditor.defaultConfig = {
		toolbar: {
			items: [
				...
				'mathpreview',
				...
			    ]
		},
	},

	MathPreview = {
		//configuration options for the math-preview plugin
		engine: 'mathjax'	//or 'katex'
	},


	...OTHER OPTIONS
};
```
*Note: the `MathPreview` configuration is optional. If not defined the rendering defaults to MathJax.*


## Use
A toolbar button is added, which functions as an on/off switch for the plugin functionality. Type some math formulas in latex in the editor using either the `\[ \]` or the  `\( \)` markers, e.g. `\[x^2+\frac{1}{x}=0\]`. When clicking anywhere in the formula, a popup appears and the formula is rendered using MathJax. The rendering updates itself on formula modification, on the fly. 


The plugin expects MathJax or katex to be loaded and configured. 