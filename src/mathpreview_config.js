export default class MathPreviewConfig {

	
	constructor() {
		this.NAME         	   = 'MathPreview';
		this.ENABLED				= true;
		this.COMMAND_INSERT         = 'math-insert';
		this.STARTMARKS=["\\[", "\\("];
		this.ENDMARKS  =["\\]", "\\)"];
		this.MODES     =['display', 'inline'];
	}

};