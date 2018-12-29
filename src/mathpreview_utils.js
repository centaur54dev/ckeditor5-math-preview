import TreeWalker 		from '@ckeditor/ckeditor5-engine/src/view/treewalker';
import ViewRange 			from '@ckeditor/ckeditor5-engine/src/view/range';
import MathPreviewConfig 	from './mathpreview_config';


const MATHCONFIG = new MathPreviewConfig;




export class MathObject  {
	constructor(){
		this.valid = false,
		this.latex ='',
		this.mode  ='',
		this.range =null
		this.outerRange =null
	}
};


export function getElementAncestor( position ) {
	let node = position.parent;
	if (node===undefined) return null;
	while (!node.is("element")){
		node = node.parent;
		if (node===undefined) break;
	}
	return node;
}


export function findMarkPos(view, position, marks, forward){
	let data={ pos: null,	mark:-1,  markPos:null	};
	let node = getElementAncestor(position);
	if (!node) return data;
	let nodeRange = view.createRangeIn(node);
	let tw = new TreeWalker( {
		boundaries: nodeRange,
		startPosition:position,
		direction: forward? 'forward':'backward',
		ignoreElementEnd : true
	});
	for (const step of tw){
		const item = step.item;
		if (item.is("text")||item.is("textProxy")){
			let earlierIndex = -1;
			for (let i =0; i<marks.length; i++){
				let mindex = forward? item.data.indexOf(marks[i]) : item.data.lastIndexOf(marks[i]);
				if (mindex>=0){
					let closer = forward? mindex<earlierIndex  : mindex>earlierIndex;
					closer = closer || earlierIndex<0;
					if (closer) {
						if (forward){
							data.pos      = view.createPositionAt(item,'before').getShiftedBy(mindex)
							data.markPos  = data.pos.getShiftedBy(2);
						}
						else{
							data.markPos  = view.createPositionAt(item,'before').getShiftedBy(mindex)
							data.pos  	  = data.markPos.getShiftedBy(2);
						}
						data.mark  = i;
						earlierIndex = mindex;
					}
				}
			}
			if (data.pos)  break;
		}
	}
	return data;
};

export function getMathRange( position, view ) {
	let out ={
		range: null,
		outerRange: null,
		mode : ''
	}

	const start = findMarkPos(view, position, MATHCONFIG.STARTMARKS, false);
	const end   = findMarkPos(view, position, MATHCONFIG.ENDMARKS,   true);

	if (start.pos !== null && end.pos !== null){
		const closerEnd = findMarkPos(view, position, MATHCONFIG.ENDMARKS, false);
		if (closerEnd.pos!==null){
			if (closerEnd.pos.isAfter(start.pos)) return out; //not valid
		}
		const closerStart = findMarkPos(view, position, MATHCONFIG.STARTMARKS, true);
		if (closerStart.pos!==null){
			if (closerStart.pos.isBefore(end.pos)) return out; //not valid
		}
		if (start.mark===end.mark){
			out.range = new ViewRange(start.pos, end.pos);
			out.outerRange = new ViewRange(start.markPos, end.markPos);
			out.mode  = MATHCONFIG.MODES[start.mark];
		}
	}
	return out;
}


export function getMath( position, view ) {
	let data  = getMathRange(position, view);
	let out   = new MathObject;
	out.valid = false;
	out.latex ='';
	out.mode  = data.mode;
	out.range = data.range;
	out.outerRange = data.outerRange;

	if (data.range !== null){
		out.valid = true;
		let items = data.range.getItems();
		for (const item of items){
			if (item.is("text")||item.is("textProxy")){
				out.latex += item.data;
			}
		}
	}
	return out;
}

