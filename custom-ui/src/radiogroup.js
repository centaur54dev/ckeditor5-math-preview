import View      from '@ckeditor/ckeditor5-ui/src/view';
import          '../theme/customui.css';

export default class RadioGroup extends View {
	/**
	 * @inheritDoc
	 */
	constructor( locale, options) {
		super( locale );

		this.set( 'value' );
        this.set( 'name' );
        
		this.options = options;

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-radio-group',
					bind.if( 'isReadOnly', 'ck-disabled' )
				]
			},
            children: this.options,
            value: bind.to( 'value' ),
			name: bind.to( 'name' ),
        } );
            
	}


    getChecked () {
        for (const item of this.options){
            if (item.inputView.isChecked()) return item.inputView.value;
        }
        return undefined;
    }

	setChecked (value) {
        for (const item of this.options){
			item.inputView.setCheck(item.inputView.value===value);
        }
    }
    




    select() {
        if(this.options.length>0)
            this.options[0].select();
	}

	focus() {
        if(this.options.length>0)
            this.options[0].focus();
	}
}
