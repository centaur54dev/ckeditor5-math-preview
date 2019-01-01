import View 				from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection 		from '@ckeditor/ckeditor5-ui/src/viewcollection';
import LabeledInputView 	from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import RadioGroup 		    from '../../custom-ui/src/radiogroup';
import InputRadioView 		from '../../custom-ui/src/inputradioview';
import LatexRenderView 		from '../../custom-ui/src/latexrenderview';
import HorizontalPanel		from '../../custom-ui/src/horizontalpanel';
import * as Utils 	        from '../mathpreview_utils';

import submitHandler 		from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
import FocusTracker 		from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler 			from '@ckeditor/ckeditor5-ui/src/focuscycler';
import KeystrokeHandler 	from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import '../../theme/mathpreview.css';







export default class MathPreviewPopupView extends View {

	
	constructor( engine, locale ) {
		super( locale );

		const t = locale.t;
		this.math         = new Utils.MathObject();
		
		this.focusTracker = new FocusTracker();  //Tracks information about DOM focus in the form.
		this.keystrokes   = new KeystrokeHandler();

		//----ui elements
		this.radioGroup_latexMode = this._createModeInput(); 
		this.latexRender          = new LatexRenderView(engine, this.locale);
		this.bottomPanel    = new HorizontalPanel(this.locale.t, [this.radioGroup_latexMode]);
		
		//----A collection of views which can be focused in the form.
		this._focusables = new ViewCollection();

		//----Helps cycling over {@link #_focusables} in the form.
		this._focusCycler = new FocusCycler( {
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate form fields backwards using the Shift + Tab keystroke.
				focusPrevious: 'shift + tab',
				// Navigate form fields forwards using the Tab key.
				focusNext: 'tab'
			}
		} );

		const bind = this.bindTemplate;

		this.setTemplate( {
			tag: 'form',

			attributes: {
				class: [
					'ck',
					'ck-mathpreview-popup',
				],

				// https://github.com/ckeditor/ckeditor5-link/issues/90
				tabindex: '-1'
			},

			children: [
				this.latexRender,
				this.bottomPanel
			],

			on:{
				'click@.ck-input-radio'  : [
					bind.to( () => {
						this.latexRender.mode = this.math.mode = this.radioGroup_latexMode.getChecked();
					} ),
					bind.to( 'modechange' )
				]
				
			}

		} );
	}

	
	
	render() {
		super.render();
		

		submitHandler( {
			view: this
		} );

		const childViews = [
			this.latexRender,
			this.bottomPanel
		];


		childViews.forEach( v => {
			this._focusables.add( v );			// Register the view as focusable.
			this.focusTracker.add( v.element );	// Register the view in the focus tracker.
		} );


		this.keystrokes.listenTo( this.element );// Start listening for the keystrokes coming from #element.
	}


	update(){
		this.latexRender.value =  this.math.latex;
		this.latexRender.mode  =  this.math.mode;
		this.radioGroup_latexMode.setChecked(this.math.mode);
	}



	focus() {
		this._focusCycler.focusFirst();
	}


	_createModeInput() {
		const t = this.locale.t;
		const optionInline  = new LabeledInputView( this.locale, InputRadioView );
		const optionDisplay = new LabeledInputView( this.locale, InputRadioView );
		
		optionInline.labelView.text  = "Inline";
		optionInline.inputView.name  = "latexmode";
		optionInline.inputView.value = "inline";
		optionInline.inputView.checked = true;
		optionDisplay.labelView.text = "Display";
		optionDisplay.inputView.name = "latexmode";
		optionDisplay.inputView.value = "display";
		optionDisplay.inputView.checked = false;

		const radioGroup    = new RadioGroup(t, [optionInline,optionDisplay]  );
		radioGroup.name = "latexmode";
		return radioGroup;
	}
}

