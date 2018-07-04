import View from '@ckeditor/ckeditor5-ui/src/view';
import          '../theme/customui.css';


export default class LatexRenderView extends View {

	constructor( locale ) {
		super( locale );


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
		if(this.mode==="inline") this.element.innerHTML = "\\(" + this.value + "\\)";
		else 					 this.element.innerHTML = "\\[" + this.value + "\\]";
		MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element], function () {
		});
	}

	render() {
		super.render();
		this.updateMath();
	}



}
