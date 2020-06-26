const PZSection = (props) => {
    const sections = Array.from(Object.keys(props.pzSections), k => props.pzSections[k]);
    let sorted_sections = sections.sort(function (a, b) {
      return a.sort_id - b.sort_id;
    })
    return (
        <ul className="pz-custom-tab-item">
            {sorted_sections.map((pzSection, index) => {
                //let pzSection = props.pzSections[pzSectionKey];
                let pzSectionTabs = pzSection.promize_tabs;
                let pzClass = (pzSection.promize_section_id == props.pzActiveSection) ? "pz-custom-tab-items active" : "pz-custom-tab-items";
                pzClass = (pzSection.section_description) ? pzClass+" "+pzSection.section_description:pzClass;
                return <li key={index}
                    className={pzClass}
                    onClick={(e) => { e.preventDefault(), props.pzSection.pzActiveSectionHandler(pzSection.promize_section_id) }}>
                    <button className={(pzSection.promize_section_id == props.pzActiveSection) ? "pz-custom-tab-btn active" : "pz-custom-tab-btn"}>
                        {pzSection.section_icon && <img src={props.pzImgUrl + pzSection.section_icon.replace(props.pzReplaceImg, '')} />}
                        {pzSection.section_name}
                    </button>
                    {/* Mobile Tab Looping */}
                    <ul className={(pzSection.promize_section_id == props.pzActiveSection) ? "pz-custom-sm-tab-item active" : "pz-custom-sm-tab-item"}>
                        {
                            Object.keys(pzSectionTabs).map((tab_key, tab_index) => {
                                return <li key={tab_index} className={(props.pzActiveTab[pzSectionTabs[tab_key].promize_section_id] == pzSectionTabs[tab_key].promize_tab_id) ? "pz-custom-tab-items active" : "pz-custom-tab-items"} onClick={(e) => { e.preventDefault(), props.HomeComponent.pzSetSelectedTab(pzSectionTabs[tab_key].promize_tab_id, pzSectionTabs[tab_key]) }}>
                                    <button className="pz-custom-tab-btn">
                                        {
                                            pzSectionTabs[tab_key].tab_icon &&
                                            <span className="pz-tab-icon">
                                                <img src={props.pzImgUrl.concat(pzSectionTabs[tab_key].tab_icon.replace(props.pzReplaceImg, ''))} />
                                            </span>
                                        }
                                        {pzSectionTabs[tab_key].tab_name}
                                    </button>
                                </li>
                            })
                        }
                    </ul>
                </li>
            })}
        </ul>
    );
}