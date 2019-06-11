var React = require('react'),
	LeafMixin = require('../../mixins/LeafFieldMixin'),
	createReactClass = require('create-react-class')
;

var e = React.createElement;

/**
 * Component for editing a long string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
var TextField = createReactClass({
	mixins: [LeafMixin],
	defaultValue: '',

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	render: function(){
		var className = 'jsonText';

		if( !this.state.editing ) {
			return e('span', {onClick: this.setEditMode, className: className}, this.props.value );
		}

		return e('textarea', {
			value: this.state.value,
			id: this.props.id,
			onChange: this.updateValue,
			placeholder: this.props.settings.placeholder || '',
			onBlur: this.setValue,
			ref: 'input'
		});
	},

	updateValue: function( e ){
		this.setState({ value: e.target.value });
	},

	isType: function( value ){
		return typeof value == 'string' && value.length > 100;
	}
});

module.exports = TextField;
