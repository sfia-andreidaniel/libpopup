/**
 * The Utils_Dom class defines helpers for manipulating the browser DOM (Document Object Model).
 *
 */

class Utils_Dom {

	public static _selector_( element: any ): any {
		return typeof element == 'string'
			? document.querySelector( element )
			: element ? element : null;
	}

	public static scrollbarSize: number = 30;

	public static hasClass( element: any, className: string ): boolean {

		element = Utils_Dom._selector_( element );

		if ( !className || !element ) {
			return false;
		}

		var classes = element.className.split( ' ' ),
		    i: number = 0,
		    len: number = classes.length;

		for ( i=0; i<len; i++ ) {
			if ( classes[i] == className ) {
				return true;
			}
		}

		return false;

	}

	public static addClass( element: any, className: string ) {

		element = Utils_Dom._selector_( element );

		if ( !element || !className ) {
			return;
		}

		var classes = String( element.className || '' ).split( ' ' ),
			outclasses: string[] = [],
		    i: number = 0,
		    len: number = classes.length;

		for ( i=0; i<len; i++ ) {
			if ( classes[i] == className ) {
				return;
			} else
			if ( classes[i] ) {
				outclasses.push( classes[i] );
			}
		}

		outclasses.push( className );

		element.className = outclasses.join( ' ' );
	}

	public static removeClass( element: any, className: string ) {

		element = Utils_Dom._selector_( element );

		if ( !element || !className || !element.className ) {
			return;
		}

		var classes = String( element.className ).split( ' ' ),
		    i: number = 0,
		    len: number = classes.length,
		    f: boolean = false;

		for ( i=0; i<len; i++ ) {
			if ( classes[i] == className ) {
				classes.splice( i, 1 );
				f = true;
				break;
			}
		}

		if ( f ) {
			element.className = classes.length
				? classes.join( ' ' )
				: null;
		}

	}

	/* Removes a list of classes from a DOM element */
	public static removeClasses( element: any, classes: string[] ) {
		element = Utils_Dom._selector_( element );

		if ( !element || !element.className || !classes.length ) {
			return;
		}

		var elClasses = String( element.className ).split( ' ' ),
		    i: number = 0,
		   	len: number = classes.length,
		   	pos: number = 0,
		   	f: boolean = false;

		for ( i=0; i<len; i++ ) {
			if ( ( pos = elClasses.indexOf( classes[i] ) ) >= 0 ) {
				elClasses.splice( pos, 1 );
				f = true;
			}
		}

		if ( f ) {
			element.className = elClasses.length
				? elClasses.join( ' ' )
				: null;
		}
	}

	/* Creates a DOM element, and optionally set it's class attribute */
	public static create( tagName: string, className: string = null ): any {
		var result: any = document.createElement( tagName );
		if ( className )
			result.className = className;
		return result;
	}

	public static selectText( input: any, start: number, length: number = null, reverse: boolean = false ) {

		if ( input ) {

			if ( length === null ) {
				length = input.value.length - start;
			}

			if ( input.createTextRange ) {
				var selRange = input.createTextRange();
				selRange.collapse(true);
				if ( !reverse ) {
					selRange.moveStart( 'character', start );
					selRange.moveEnd( 'character', start + length );
				} else {
					selRange.moveStart('character', start + length);
					selRange.moveEnd('character', -length );
				}

				selRange.select();

			} else
			if ( input.setSelectionRange ) {
				if (!reverse) {
					input.setSelectionRange(start, start + length);
				} else {
					input.setSelectionRange(start, start + length, 'backward' );
				}
			} else
			if ( typeof input.selectionStart != 'undefined' ) {
				if ( !reverse ) {
					input.selectionStart = start;
					input.selectionEnd = start + length;
				} else {
					input.selectionStart = start + length;
					input.selectionEnd = start;
				}
			}

		}

	}

	public static getCaretPosition( input: any ): number {
		// Initialize
		var iCaretPos = 0;

		if (document['selection']) {
			var oSel = document['selection'].createRange ();
			oSel.moveStart ('character', -input.value.length);
			iCaretPos = oSel.text.length;
		} else 
		if ( input.selectionStart || input.selectionStart == '0' )
			iCaretPos = input.selectionStart;

		return (iCaretPos);
	}

}

if ( Global.isBrowser ) {
	Global.env.addEventListener( 'load', function() {
		// measure the scrollbar width
		var d = Utils_Dom.create('div');
		d.style.cssText = 'overflow:scroll;width:100px;height:40px;';
		document.body.appendChild(d);
		Utils_Dom.scrollbarSize = 100 - d.clientWidth;
		d.parentNode.removeChild(d);
	}, true );
}