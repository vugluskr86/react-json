'use strict';

var React = require('react'),
	deepSettings = require('./deepSettings'),
	objectAssign = require('object-assign'),
	PropTypes = require('prop-types'),
	createReactClass = require('create-react-class')
;

var components = {};
var typeCheckOrder = [];

var TypeField = createReactClass({
	components: {},
	typeCheckOrder: [],

	contextTypes: {
		typeDefaults: PropTypes.object
	},

	render: function() {
		var Component = this.getComponent(),
			settings = objectAssign(
				{},
				this.context.typeDefaults[ this.props.type ],
				this.props.settings
			)
		;

		this.addDeepSettings( settings );

		return React.createElement( Component, {
			value: this.props.value,
			settings: settings,
			onUpdated: this.props.onUpdated,
			id: this.props.id,
			ref: 'field'
		});
	},

	getComponent: function(){
		var type = this.props.type;
		if( !type )
			type = this.guessType( this.props.value );

		this.fieldType = type;

		return this.components[ type ];
	},

	guessType: function( value ){
		var type = false,
			i = 0,
			types = this.typeCheckOrder,
			component
		;

		while( !type && i < types.length ){
			component = this.components[ types[i] ].prototype;
			if( component.isType && component.isType( value ) )
				type = types[i++];
			else
				i++;
		}

		return type || 'object';
	},

	getValidationErrors: function( jsonValue ){
		return this.refs.field.getValidationErrors( jsonValue );
	},

	addDeepSettings: function( settings ){
		var parentSettings = this.props.parentSettings || {},
			deep
		;

		for( var key in deepSettings ){
			deep = deepSettings[ key ]( parentSettings[key], settings[key] );
			if( typeof deep != 'undefined' )
				settings[ key ] = deep;
		}
 	}
});

TypeField.registerType = function( name, Component, selectable ){
	var proto = TypeField.prototype;
	proto.components[ name ] = Component;
	if( selectable )
		proto.typeCheckOrder.unshift( name );
};

module.exports = TypeField;
