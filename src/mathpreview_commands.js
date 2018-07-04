import Command 				from '@ckeditor/ckeditor5-core/src/command';
import MathPreviewConfig 	from './mathpreview_config';




const MATHCONFIG = new MathPreviewConfig;

export class LatexMathInsertCommand extends Command {

	execute( math ) {
		if (!math) return;
		if (!math.valid) return;
		let modelRng = this.editor.editing.mapper.toModelRange(math.outerRange);
		if (!modelRng) throw "LatexMathInsertCommand> invalid math range";
		let modeindex = MATHCONFIG.MODES.findIndex(x => x===math.mode);
		if (modeindex<0) throw "LatexMathInsertCommand> invalid math mode"	
		let modelPos0 = modelRng.start;
		let newmath = MATHCONFIG.STARTMARKS[modeindex] + math.latex + MATHCONFIG.ENDMARKS[modeindex];

		this.editor.editing.model.change( writer => {
			if (!modelRng.isCollapsed){
				writer.remove(modelRng);
			}
			const txt = writer.createText(newmath)
			writer.insert(txt, modelPos0);
			writer.setSelection(modelPos0.getShiftedBy(2));
		} );
	}
}



