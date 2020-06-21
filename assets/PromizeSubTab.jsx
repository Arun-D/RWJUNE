class PromizeSubTab extends React.Component {
    render() {
        let {pzCustomizer, pzSubTabDetail, pzActiveOptions} = this.props
        let subtabs = Object.keys(pzCustomizer.subtabs).length > 0 ? pzCustomizer.subtabs[pzSubTabDetail.promize_tab_id] : {}
        return (
            <React.Fragment>
                <PZSubTab pzSubTab={this.props.pzSubTabDetail} {...this.props} {...this.state} />
                {subtabs && Object.keys(subtabs).length > 0 && Object.keys(subtabs).map((tabKey, index) => {
                    if (subtabs[tabKey].parent_tab_id == pzSubTabDetail.promize_tab_id) {
                        return <PZSubTab pzSubTab={pzCustomizer.tabs[tabKey]} {...this.props} {...this.state} />
                    }else if (Object.keys(pzActiveOptions).length > 0) {
                        return Object.keys(pzActiveOptions).map((active_Option) => {
                        if (parseInt(subtabs[tabKey].parent_option_id) == parseInt(pzActiveOptions[active_Option][1])) {
                            return <PZSubTab pzSubTab={pzCustomizer.tabs[tabKey]} {...this.props} {...this.state} />
                        }
                        })
                    }
                    })
                }
            </React.Fragment>
        );

    }
}
