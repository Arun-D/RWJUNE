const PZJscolor = (props) => {
    return (
        <React.Fragment>
            <input
                id="pzColorPicker"
                className="jscolor-input {hash:true,styleElement:'',onFineChange:'jsColorOnFineChange(this)'}"
                value={props.value}
                onChange={() => { }}
                onFocus={(e) => { e.preventDefault(), props.showColorPicker(e) }}
                maxLength="7"
            />
        </React.Fragment>
    );
}