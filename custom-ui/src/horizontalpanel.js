import View      from '@ckeditor/ckeditor5-ui/src/view';
import          '../theme/customui.css';



export default class HorizontalPanelView extends View {

	constructor( locale, children) {
		super( locale );


        
		this.children = children;

	
		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-horizontal-panel',
				]
			},
            children: this.children,
        } );
            
	}

}