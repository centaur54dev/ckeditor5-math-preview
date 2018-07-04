import View      from '@ckeditor/ckeditor5-ui/src/view';
import          '../theme/customui.css';



export default class InputRadioView extends View {

	constructor( locale ) {
		super( locale );

		this.set( 'value' );
		this.set( 'name' );
		this.set( 'id' );

		this.set( 'isReadOnly', false );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'input',
			attributes: {
				type: 'radio',
				class: [
					'ck',
					'ck-input',
					'ck-input-radio'
				],
				id: bind.to( 'id' ),
				name: bind.to( 'name' ),
				value: bind.to( 'value' ),
				readonly: bind.to( 'isReadOnly' ),
			}
		} );
	}

	setCheck(val){
		this.element.checked = val;
	}

	isChecked(){
		return this.element.checked;
	}


	render() {
		super.render();
	}

	/**
	 * Moves the focus to the input and selects the value.
	 */
	select() {
		this.element.select();
	}

	/**
	 * Focuses the input.
	 */
	focus() {
		this.element.focus();
	}
}
