class PromizeViews extends React.Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount(){
    //     if (this.props.pzTotalViews > 1) {
    //         this.pzUpdateViews();
    //     }
    // }

    componentDidUpdate() {
        if (this.props.pzTotalViews > 1) {
            this.pzUpdateViews();
        }
    }
    
    pzUpdateViews = () => {
        var pzCanvasObjects = { ...this.props.pzCanvasObject };
        (pzCanvasObjects) && Object.keys(pzCanvasObjects).map((viewId) => {
            var thumbCanvas = new fabric.StaticCanvas('thumbView_' + viewId, { renderOnAddRemove: true });
            pzLoadCanvasObjects({pzCurrentView :viewId, pzCanvas :thumbCanvas, pzCanvasObject : pzCanvasObjects})
        });

    }
    pzChangeView = (viewIndex) => {
        this.props.HomeComponent.setState({ "pzCurrentView": viewIndex },()=>{
            this.props.HomeComponent.pzReloadCanvasObjects();
        })
    }

    render() {
        let pzViews = Object.keys(this.props.pzCustomizer).length > 0 ? JSON.parse(this.props.pzCustomizer.product.model_image) : []
        return (
            <React.Fragment>
                {
                    (this.props.pzTotalViews > 1) ? <PZViews pzViews={pzViews} pzCurrentView={this.props.pzCurrentView} pzChangeView={this.pzChangeView} /> : ''
                }
            </React.Fragment>
        );
    }
}
