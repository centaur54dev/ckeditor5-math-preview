import View from '@ckeditor/ckeditor5-ui/src/view';
import          '../theme/customui.css';


export default class LatexRenderView extends View {

	constructor( engine, locale ) {
		super( locale );

		this.engine = engine;
		this.set( 'value', "" );
		this.set( 'mode',  "");
		this.on( 'change:value', ( evt, name, value ) => {
			this.updateMath();
		} );
		this.on( 'change:mode', ( evt, name, value ) => {
			this.updateMath();
		} );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-latex-render'
				],
			}
		} );
	}

	updateMath(){
		if (this.engine=='mathjax'){
			if(this.mode==="inline") this.element.innerHTML = "\\(" + this.value + "\\)";
			else 					 this.element.innerHTML = "\\[" + this.value + "\\]";
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element], function () {
			});
		}
		else if (this.engine=='katex'){
			katex.render(this.value, this.element, {
				displayMode: this.mode==='display',
				throwOnError: false
			});
		}
	}

	render() {
		super.render();
		this.updateMath();
	}



}
