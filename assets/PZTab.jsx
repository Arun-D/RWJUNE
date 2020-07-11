const PZTab = (props) => {
  const tabs = Array.from(Object.keys(props.pzTabs), k => props.pzTabs[k]);
  let sorted_tabs = tabs.sort(function (a, b) {
    //if ((!props.nextPageData && pzTab.tab_description != "nextstep") ||
    //(pzTab.tab_description == "nextstep" && props.nextPageData)) {
    return a.sort_id - b.sort_id;
    //}
  })
  console.log("sorted_tabs ", sorted_tabs)
  let result = [];
  if (Object.keys(props.pzActiveOptions).length > 0) {
    result = Object.keys(props.pzActiveOptions).map((key) => {
      return props.pzActiveOptions[key][1];
    });
  }
  let displayTabs = [];
  sorted_tabs.map((pzTab, index) => {
    if (pzTab.is_sub_tab == 0) {
      if ((props.nextPageData && pzTab.tab_description != "nextstep") || (!props.nextPageData && pzTab.tab_description == "nextstep")) {
        console.log("god jesus", pzTab.tab_name)
        return false
      }
      else {
        displayTabs.push(pzTab.promize_tab_id);
      }
    }
    let subtabs = Object.keys(props.pzCustomizer.subtabs).length > 0 ? props.pzCustomizer.subtabs[pzTab.promize_tab_id] : {}
    subtabs && Object.keys(subtabs).length > 0 && Object.keys(subtabs).map((tabKey, index) => {
      if (result.includes(subtabs[tabKey].parent_option_id)) {
        displayTabs.push(props.pzTabs[tabKey].promize_tab_id)
      }
    });
  })

  console.log("displayTabs ", displayTabs)
  return (
    <React.Fragment>
      {
        <React.Fragment>
          <div class="pz-custom-item-menu">
            <ul className="pz-custom-tab-item">
              <React.Fragment>
                {sorted_tabs.map((pzTab, index) => {
                  if ((props.nextPageData && pzTab.tab_description != "nextstep") || (!props.nextPageData && pzTab.tab_description == "nextstep")) {
                    console.log("god jesus", pzTab.tab_name)
                    //return false
                  }
                  else {
                    console.log("else ", pzTab.tab_name)
                    return (<li className={(props.pzActiveTab[pzTab.promize_section_id] == pzTab.promize_tab_id) ? "pz-custom-tab-items active" : (displayTabs.includes(pzTab.promize_tab_id)) ? "pz-custom-tab-items" : "pz-custom-tab-items hide"} onClick={(e) => { e.preventDefault(), props.HomeComponent.pzSetSelectedTab(pzTab.promize_tab_id, pzTab) }}><button className={(props.pzActiveTab[pzTab.promize_section_id] == pzTab.promize_tab_id) ? "pz-custom-tab-btn active" : "pz-custom-tab-btn"} >{pzTab.tab_name}</button></li>);
                  }
                })}
              </React.Fragment>
            </ul>
          </div>
          <div className="pz-custom-content-wrapper">
            <div className="pz-custom-item-content">
              {
                sorted_tabs.map((pzTab, index) => {
                  if ((props.nextPageData && pzTab.tab_description != "nextstep") || (!props.nextPageData && pzTab.tab_description == "nextstep")) {
                    console.log("god jesus", pzTab.tab_name)
                    //return false
                  }
                  else {
                    console.log("here pztab ", pzTab)
                    return (
                      <React.Fragment>
                        <div key={index} className={(props.pzActiveTab[pzTab.promize_section_id] == pzTab.promize_tab_id && props.pzActiveSection == pzTab.promize_section_id) ? `pz-custom-items open` : (props.pzActiveSection != pzTab.promize_section_id ? `pz-custom-items hide` : `pz-custom-items hide`)}>
                          <div className={"pz-custom-item-body"}>
                            <PromizeAttribute pzTab={pzTab} pzTabType="Tab" {...props} />
                          </div>
                        </div>
                      </React.Fragment>
                    )
                  }
                })
              }
            </div></div></React.Fragment>}
    </React.Fragment>
  );
}