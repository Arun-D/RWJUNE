class PromizeTab extends React.Component {

    componentWillMount() {
        const { pzCustomizer } = this.props;
        const tabs = this.props.pzCustomizer.tabs ? this.props.pzCustomizer.tabs : {}
        Object.keys(tabs).length > 0 && Object.keys(tabs).map((tab, index) => {
            fetch(this.props.pzApiUrl + 'getSubTabsWithTabId/?id=' + tab)
                .then(res => res.json())
                .then(response => {
                    response.subtabs.length > 0 && response.subtabs.map((sub_tab, tab_idex) => {
                        if (!pzCustomizer.subtabs[tab]) {
                            pzCustomizer.subtabs[tab] = {}
                        }
                        pzCustomizer.subtabs[tab][sub_tab.child_tab_id] = sub_tab
                    })
                    this.props.HomeComponent.setState({ pzCustomizer });
                })
        })
    }

    render() {
        const tabs = this.props.pzCustomizer.tabs ? this.props.pzCustomizer.tabs : {}
        return (
            <React.Fragment>
                {(Object.keys(tabs).length > 0) && <PZTab pzTabs={tabs} {...this.props} />}
            </React.Fragment>
        );
    }
}
