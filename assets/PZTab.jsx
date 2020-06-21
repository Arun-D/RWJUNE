const PZTab = (props) => {
  const tabs = Array.from(Object.keys(props.pzTabs), k => props.pzTabs[k]);
  let sorted_tabs = tabs.sort(function (a, b) {
    return a.sort_id - b.sort_id;
  })
  return (
    <div className="pz-custom-item-content">
      {
        sorted_tabs.map((pzTab, index) => {
          //let pzTab = props.pzTabs[pzTabKey];
          let pzSubDisplay = {};
          let pzSubTabDetail = {};
          let subtabs = Object.keys(props.pzCustomizer.subtabs).length > 0 ? props.pzCustomizer.subtabs[pzTab.promize_tab_id] : {}
          subtabs && Object.keys(subtabs).length > 0 && Object.keys(subtabs).map((tabKey, index) => {
            if (Object.keys(props.pzActiveOptions).length > 0) {
              return Object.keys(props.pzActiveOptions).map((active_Option) => {
                if (parseInt(subtabs[tabKey].parent_option_id) == parseInt(props.pzActiveOptions[active_Option][1])) {
                  pzSubDisplay = JSON.parse(props.pzTabs[tabKey].additional_data);
                  pzSubTabDetail = props.pzTabs[tabKey];
                }
              })
            }
          });
          if (pzTab.is_sub_tab == 1 || props.pzHideTabs.includes(pzTab.promize_tab_id)) {
            return ''
          }

          return (
            <React.Fragment>
              <div key={index} className={(props.pzActiveTab[pzTab.promize_section_id] == pzTab.promize_tab_id && props.pzActiveSection == pzTab.promize_section_id) ? `pz-custom-items open` : (props.pzActiveSection != pzTab.promize_section_id ? `pz-custom-items hide`  :`pz-custom-items`)}>
                <div className="pz-custom-item-header" onClick={(e) => { e.preventDefault(), props.HomeComponent.pzSetSelectedTab(pzTab.promize_tab_id, pzTab) }}>
                  {
                    pzTab.tab_icon &&
                    <div className="pz-tab-icon">
                      <img src={props.pzImgUrl.concat(pzTab.tab_icon.replace(props.pzReplaceImg, ''))} style={{ width: 20, height: 20 }} />
                    </div>
                  }
                  <h4 className="pz-item-header">
                    <span className="pz-item-title-text">{pzTab.tab_name}</span>
                  </h4>
                </div>
                <div className={"pz-custom-item-body"}>
                  <PromizeAttribute pzTab={pzTab} pzTabType="Tab" {...props} />
                  {subtabs && Object.keys(subtabs).length > 0 && Object.keys(subtabs).map((tabKey, index) => {
                    if (subtabs[tabKey].parent_tab_id == pzTab.promize_tab_id) {
                      return <PromizeSubTab key={index} pzSubTabDetail={props.pzTabs[tabKey]} {...props} />
                    }
                  })
                  }
                  {(pzSubDisplay && pzSubDisplay.inherit && pzSubDisplay.inherit == 1) && <PromizeSubTab pzSubTabDetail={pzSubTabDetail} {...props} />}
                </div>
              </div>
              {(pzSubDisplay && pzSubDisplay.inherit && pzSubDisplay.inherit == 2) && <PromizeSubTab pzSubTabDetail={pzSubTabDetail} {...props} />}
            </React.Fragment>
          )
        })
      }
    </div>
  );
}