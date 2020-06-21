class PromizeCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvasurl: '',
            minquantity: 1,
            maxquantity: 10000,
            quantitymultiples: 1,
            showEmailPopUp: false,
            editUrl: '',
            selectedValues : {},
            pzSettings : {
                    1:0, //zoom,
                    2:0, // full screen,
                    3:0, //undo redo,
                    4:0, //share
                    5:0, //save for later
                    6:0, //download
                    7:0, //add to cart
                    8:0, //start over
                    9:0, //quantity
                    10:0 //price
            }
        }
    }
    pzDownloadHandler = (canvasobject) => {
        var download = document.getElementById('download');
        var image = document.getElementById('pz_preview_image').toDataURL('image/png');
        this.setState({ canvasurl: image }, () => {
            download.click();
        })

    }
    pzShare = () => {
        let selectedValues  = pzGetSelectedValues(this.props.pzCanvasObject, this.props.pzProductPrice, this.props.pzActiveOptions, this.props.pzCustomizer)
        pzSaveForLater(this.props).then((response) => {
            var editUrl = response;
            this.setState({ showEmailPopUp: true, editUrl: editUrl, selectedValues: selectedValues })
        })
    }
    pzStartOverHandler = () => {
        this.props.HomeComponent.setState({pzPopup : true})
       
    }
    pzQuantityHandler = (e, value) => {
        e.preventDefault();
        let {pzProductPrice, pzQuantity} = this.props
        let price = pzQuantity ? parseFloat(pzProductPrice) / parseInt(pzQuantity) : parseFloat(pzProductPrice)
        pzProductPrice = value ? (parseFloat(price) * parseFloat(value)) : (parseInt(e.target.value) > 0 ? parseFloat(price) * parseInt(e.target.value) : parseFloat(price) );
        this.props.HomeComponent.setState({pzProductPrice, pzQuantity : value ? parseInt(value) : (parseInt(e.target.value) === 0 ? 1 : parseInt(e.target.value)) })
    }

    render() {
        return (
            <React.Fragment>
                <PZCart {...this.props} {...this.state} IncrementItem={this.IncrementItem} DecreaseItem={this.DecreaseItem} pzDownloadHandler={this.pzDownloadHandler} pzStartOverHandler={this.pzStartOverHandler} pzQuantityHandler={this.pzQuantityHandler} canvasurl={this.state.canvasurl} pzShare={this.pzShare} pzAddToCart={this.props.HomeComponent.pzAddToCart}/>
                {this.state.showEmailPopUp && <PromizeMailShare {...this.props} {...this.state} cart={this} />}
            </React.Fragment>
        );
    }
}
