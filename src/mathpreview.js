import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MathPreviewUI from './mathpreview_ui';


export default class MathPreview extends Plugin {

	static get requires() {
		return [ MathPreviewUI ];
	}


	static get pluginName() {
		return 'MathPreview';
	}


	
}
