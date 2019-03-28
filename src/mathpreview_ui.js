import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver 		from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon 	from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler 	from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import ButtonView 			from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import {LatexMathInsertCommand} from './mathpreview_commands';

import MathPreviewConfig 	from './mathpreview_config';
import MathPreviewPopupView from './ui/mathpreview_popupview';
import * as Utils 	        from './mathpreview_utils';
import mathpreviewIcon 		from '../theme/icons/mathpreview.svg';



const MATHCONFIG = new MathPreviewConfig;


export default class MathPreviewhUI extends Plugin {

	static get requires() {
		return [ MathPreviewConfig, ContextualBalloon ];
	}


	init() {
		const editor = this.editor;
		let   engine = 'mathjax'
		const config = editor.config.get(( 'MathPreview' ))
		if (typeof config !== 'undefined'){
			engine = this._safeGet(config.engine, engine);
		}


		editor.editing.view.addObserver( ClickObserver );

		this.popupView = this._createPopupView(engine);

		this._balloon = editor.plugins.get( ContextualBalloon );

		this._createToolbarButton();

		this._enableUserBalloonInteractions();// Attach lifecycle actions to the the balloon.

		editor.commands.add( MATHCONFIG.COMMAND_INSERT,   new LatexMathInsertCommand( editor ) );
	}



	_createPopupView(engine) {
		const editor = this.editor;
		const popupView    = new MathPreviewPopupView( engine,  editor.locale );
	
		popupView.keystrokes.set( 'Esc', ( data, cancel ) => {
			this._hideUI();
			cancel();
		} );

		this.listenTo( popupView, 'modechange', () => {		
			editor.execute( MATHCONFIG.COMMAND_INSERT, popupView.math );
		} );

		return popupView;
	}

	
	_createToolbarButton() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( MATHCONFIG.NAME, locale => {
			const button = new ButtonView( locale );

			button.isEnabled = true;
			button.isOn      = true;
			button.label = t( 'Preview Math (on mouse click)' );
			button.icon = mathpreviewIcon;
			button.tooltip = true;

			this.listenTo( button, 'execute', () => {
				MATHCONFIG.ENABLED = !MATHCONFIG.ENABLED 
				button.isOn = MATHCONFIG.ENABLED;
			});

			return button;
		} );
	}


	_enableUserBalloonInteractions() {
		const viewDocument = this.editor.editing.view.document;

		// Handle click on view document and show panel when selection is placed inside the math element.
		// Keep panel open until selection will be inside the same math element.
		this.listenTo( viewDocument, 'click', () => {
			const math = this._getSelectedMath();
			if ( math.valid ) {
				this._addPopupView(math);
			}
		} );

		// Focus the form if the balloon is visible and the Tab key has been pressed.
		this.editor.keystrokes.set( 'Tab', ( data, cancel ) => {
			if ( this._isPopupVisible && !this.popupView.focusTracker.isFocused ) {
				this.popupView.focus();
				cancel();
			}
		}, {
			// Use the high priority because the math UI navigation is more important
			// than other feature's actions, e.g. list indentation.
			// https://github.com/ckeditor/ckeditor5-link/issues/146
			priority: 'high'
		} );

		// Close the panel on the Esc key press when the editable has focus and the balloon is visible.
		this.editor.keystrokes.set( 'Esc', ( data, cancel ) => {
			if ( this._isPopupVisible ) {
				this._hideUI();
				cancel();
			}
		} );

		// Close on click outside of balloon panel element.
		clickOutsideHandler( {
			emitter: this.popupView,
			activator: () => this._isPopupVisible,
			contextElements: [ this._balloon.view.element ],
			callback: () => this._hideUI()
		} );
}


	_addPopupView(data) {
		if ( this._isPopupInPanel || MATHCONFIG.ENABLED===false) {
			return;
		}
		this._balloon.add( {
			view: this.popupView,
			position: this._getBalloonPositionData(data)
		} );
		this.popupView.math = data;
		this.popupView.update();
		

		this.listenTo( this.editor.editing.view, 'render', () => {
			if (this._isPopupVisible){
				let math = this._getSelectedMath();
				if (math.valid){
					this.popupView.math =  math;
					this.popupView.update();
				}
				else{
					this._hideUI();
				}
			}
		});

	}






	
	_hideUI() {
		if ( !this._isPopupInPanel ) {
			return;
		}
		this.stopListening( this.editor.editing.view, 'render' );
		this._balloon.remove( this.popupView );
	}



	/*Returns true when popupView  is in the  balloon*/
	get _isPopupInPanel() {
		return this._balloon.hasView( this.popupView );
	}


	/*Returns true when  popupView balloon and it is
	 * currently visible.*/
	get _isPopupVisible() {
		return this._balloon.visibleView === this.popupView;
	}

	
	_getBalloonPositionData(mathData) {
		const view = this.editor.editing.view;
		const target = mathData.valid ?
				// When selection is inside math element, then attach panel to this element.
				view.domConverter.viewRangeToDom( mathData.range ) :
				// Otherwise null.
				null;
		return {target} ;
	}

	
	_getSelectedMath() {
		const selection = this.editor.editing.view.document.selection;
		//const selection =  this.editor.editing.view.createSelection( this.editor.editing.view.document.selection );
		if ( selection.isCollapsed ) {
			return Utils.getMath( selection.getFirstPosition(), this.editor.editing.view );
		} else {
			return {valid:false};
		}
	}


	_safeGet(input, safeDefault){
		if( typeof input !== 'undefined' &&  (input || input===false || input===0) ){
			return input;
		}
		else{
			return safeDefault;
		}
	}
}

