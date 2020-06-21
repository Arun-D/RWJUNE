class JsColor extends React.Component {
	/**
	 * JsColor Constructor
	 * @param {*} props
	 */
    constructor(props) {
        super(props);
        // Initial state
        this.state = {
            color: props.value,
        };

		/**
		 * Create references
		 */
        this.colorInput = React.createRef();

        // Bind methods
        this.onChange = this.onChange.bind(this);
        this.showColorPicker = this.showColorPicker.bind(this);
    }

	/**
	 * Component mounted
	 */
    componentDidMount() {
        // Setup jscolor
        window.jscolor.installByClassName('jscolor-input');
        this.colorInput.current.addEventListener('change', this.onChange);
        this.colorInput.current.addEventListener('input', this.onChange);

        // Set background and color
        this.colorInput.current.style.background = this.state.color;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.value !== this.state.color) {
            this.colorInput.current.style.background = this.props.value;
        }
    }

	/**
	 * Component will unmount
	 */
    componentWillUnmount() {
        this.colorInput.current.removeEventListener('change', this.onFineChange);
        this.colorInput.current.removeEventListener('input', this.onFineChange);
    }

	/**
	 * On JsColor value change
	 */
    onChange() {
        // Set state and call parent methods upon success set
        this.setState({ color: this.colorInput.current.jscolor.toHEXString() }, () => {
            this.colorInput.current.style.background = this.state.color;
            this.props.onChange(this.state.color);
        });
    }
	/**
	 * Show color picker
	 */
    showColorPicker() {
        this.colorInput.current.jscolor.show();
    }

	/**
	 * Render component
	 */
    render() {
        return (
            <input
                id={this.props.id}
                className="jscolor-input"
                value={this.props.value}
                onChange={this.props.onChange}
                onFocus={this.showColorPicker}
                ref={this.colorInput}
                maxLength="7"
            />
        );
    }
}
