class PromizeMailShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            sharedLink: props.editUrl,
            selectedValues : props.selectedValues,
            errors: {},
            mailStatus: ''
        }
    }
    handleUserInput = (e) => {
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({ fields });
    }
    closeMailPopup = (e) => {
        this.props.cart.setState({ showEmailPopUp: false })
        this.props.HomeComponent.setState({pzPageLoader : false})
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.HomeComponent.setState({pzPageLoader : true})
        if (this.validateForm()) {
            let fields = {};
            fields["sendermail"] = "";
            fields["receivermail"] = "";
            fields["message"] = "";
            fields["mailsent"] = "";
            // var canvasObjects = [];
            // const { pzCanvasObject } = this.props;
            // let canvasObject = pzCanvasObject[this.props.pzCurrentView];

            // for (var key in canvasObject) {
            //     const currViewFCObject = canvasObject[key];
            //     if (currViewFCObject.name) {
            //         canvasObjects.push(currViewFCObject);
            //     } else {
            //         for (var innerKey in currViewFCObject) {
            //             canvasObjects.push(currViewFCObject[innerKey])
            //         }
            //     }
            // }

            // let pzCanvasObjects = {};
            let imagedata = {};
            var image = document.getElementById('pz_preview_image').toDataURL('image/png');
            imagedata.src = image;

            // JSON.stringify(canvasObjects);
            // pzCanvasObjects['canvasobject'] = JSON.stringify(canvasObjects);
            // var canvas = document.getElementById('pz_preview_image');
            // var width = canvas.width;
            // var height = canvas.height;
            // pzCanvasObjects.width = width;
            // pzCanvasObjects.height = height;

            const data = {
                sendermail: this.state.fields.sendermail,
                receivermail: this.state.fields.receivermail,
                message: this.state.fields.message,
                sharedLink: this.state.sharedLink,
                selectedValues : this.state.selectedValues
            }
            const { pzApiUrl } = this.props;
            var canvasimage = '';

            var currentThis = this;
            $.ajax({
                type: "POST",
                dataType: "json",
                crossDomain: true,
                url: "https://live.productimize.com/promizenode/convertCanvasToImage",
                data: imagedata,
                success: function (response) {
                    canvasimage = response.filePath;
                    canvasimage = pzApiUrl + canvasimage.slice(2);
                    data['image'] = canvasimage;
                    $.ajax({
                        type: "POST",
                        crossDomain: true,
                        url: "https://cloud.productimize.com/prokapchn/email.php",
                        data: data,
                        success: (res) => {
                            console.log(res);
                            currentThis.setState({ fields: fields, mailStatus: 'ok' });
                            setTimeout(
                                function () {
                                    currentThis.props.cart.setState({ showEmailPopUp: false })
                                    currentThis.props.HomeComponent.setState({pzPageLoader : false})
                                }, 1000);

                        },
                        error: (err) => {
                            currentThis.setState({ fields: fields, mailStatus: 'err' });
                        }
                    });
                },
                error: function (err) {
                    console.log("something went wrong!")
                }
            });

        }
    }
    validateForm() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["sendermail"]) {
            formIsValid = false;
            errors["sendermail"] = "*Please enter sender email-ID.";
        }

        if (typeof fields["sendermail"] !== "undefined") {
            //regular expression for email validation
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(fields["sendermail"])) {
                formIsValid = false;
                errors["sendermail"] = "*Please enter valid sender email-ID.";
            }
        }

        if (!fields["receivermail"]) {
            formIsValid = false;
            errors["receivermail"] = "*Please enter receiver email-ID.";
        }

        if (typeof fields["receivermail"] !== "undefined") {
            //regular expression for email validation
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(fields["receivermail"])) {
                formIsValid = false;
                errors["receivermail"] = "*Please enter valid reciver email-ID.";
            }
        }

        this.setState({
            errors: errors
        });
        return formIsValid;
    }

    render() {
        return (
            <React.Fragment>
                {<PZMailShare handleSubmit={this.handleSubmit} handleUserInput={this.handleUserInput} {...this.props} {...this.state} closeMailPopup={this.closeMailPopup} />}
            </React.Fragment>
        );
    }
}
