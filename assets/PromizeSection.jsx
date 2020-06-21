class PromizeSection extends React.Component {
    constructor(props) {
        super(props);
    }
    pzActiveSectionHandler = (sectionId) => {
        const {pzActiveTab, pzCustomizer, pzCurrentView} =this.props
        let pzChangeView = pzCurrentView
        if(pzActiveTab[sectionId] && pzCustomizer.tabs[pzActiveTab[sectionId]] && pzCustomizer.tabs[pzActiveTab[sectionId]].default_view){
            pzChangeView = pzCustomizer.tabs[pzActiveTab[sectionId]].default_view
        }
        this.props.HomeComponent.setState({ pzActiveSection: parseInt(sectionId), pzCurrentView : pzChangeView},()=>{
            if(pzCurrentView != pzChangeView){
                this.props.HomeComponent.pzReloadCanvasObjects()
            }
        });
    }

    render() {
        console.log("testing", this.props)
        let sections = this.props.pzCustomizer.sections ? this.props.pzCustomizer.sections : {}
        return (
            <React.Fragment>
                {(Object.keys(this.props.pzCustomizer.sections).length > 0 ) && <PZSection pzSections={sections} pzSection={this} {...this.props} />}
            </React.Fragment>
        );
    }
}
