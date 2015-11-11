/**
 * Core eventing class, which stands at the base of most classes in this framework.
 */
class UI_Event {

	private $EVENTS_QUEUE : {};
	private $EVENTS_ENABLED: boolean = true;

	constructor(){}

	/**
	 * Adds an event listener to eventName
	 *
	 * @param eventName - the name of the event where the callback should run.
	 * @param callback - a function which is executed each time an event with name eventName is fired. You can use
	 * this inside the callback.
	 */
	public on( eventName: string, callback: ( ...args ) => void ) {
		
		this.$EVENTS_QUEUE = this.$EVENTS_QUEUE || {};

		if ( !this.$EVENTS_QUEUE[ eventName ] )
			this.$EVENTS_QUEUE[ eventName ] = [];
		this.$EVENTS_QUEUE[ eventName ].push( callback );
	}

	/**
	 * Removes the event listener callback from event eventName.
	 *
	 * @param eventName - if null, all events are removed from the event.
	 * @param callback - the callback which should be removed. If null, all events binded to eventName are removed.
	 */
	public off( eventName: string, callback: ( ... args ) => void ) {

		if ( eventName ) {

			if ( callback ) {

				if ( this.$EVENTS_QUEUE && this.$EVENTS_QUEUE[ eventName ] ) {
					for ( var i = this.$EVENTS_QUEUE[ eventName ].length - 1; i>=0; i-- ) {
						if ( this.$EVENTS_QUEUE[ eventName ][ i ] == callback ) {
							this.$EVENTS_QUEUE[eventName].splice(i, 1);
							return;
						}
					}
				}
			} else {
				if ( typeof this.$EVENTS_QUEUE[ eventName ] != 'undefined' ) {
					delete this.$EVENTS_QUEUE[ eventName ];
				}
			}

		} else {

			// drops the $EVENTS_QUEUE AT ALL
			this.$EVENTS_QUEUE = undefined;

		}

	}

	/**
	 * Fires all callbacks associated with event eventName. You can use "this" in the context
	 * of the callbacks.
	 *
	 * @param eventName - the name of the event which should be fired.
	 * @param ...args - arguments that are applied with the "this" context to each binded callback.
	 */
	public fire( eventName: string, ...args ) {

		var hasNull: boolean = false,
		    i: number,
		    len: number,
		    queue: any[];

		if ( this.$EVENTS_ENABLED ) {

			if ( this.$EVENTS_QUEUE && this.$EVENTS_QUEUE[ eventName ] ) {

				queue = this.$EVENTS_QUEUE[eventName].slice(0);				

				for ( i=0, len = queue.length; i<len; i++ ) {
					queue[i].apply(this, args);
				}

			}
		}
	}

	/**
	 * Destructor. Unbinds all events and all dom event listeners.
	 */
	public free() {
		this.off(null, null);
	}

	/**
	 * A method to enable or disable all events on this object.
	 */
	public setEventingState( enabled: boolean ) {
		this.$EVENTS_ENABLED = !!enabled;
	}

}