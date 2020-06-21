const PZSubTab = (props) => {
  let pzSubTab = props.pzSubTab;
  var pzSubDisplay = pzSubTab && JSON.parse(pzSubTab.additional_data);
  if (props.pzHideTabs.includes(pzSubTab.promize_tab_id)) {
    return ''
  }
  return (
    <div id={pzSubTab.promize_tab_id} className={(pzSubDisplay && pzSubDisplay.inherit && pzSubDisplay.inherit != 0) ? 'pz-custom-items pz-secondary-items open' : 'pz-custom-items pz-secondary-items hide'}>
      <div className="pz-custom-item-header">
        {
          pzSubTab.tab_icon &&
          <div className="pz-tab-icon">
            <img src={props.pzImgUrl.concat(pzSubTab.tab_icon.replace(props.pzReplaceImg, ''))} style={{ width: 20, height: 20 }} />
          </div>
        }
        <h4 className="pz-item-header">
          <span className="pz-item-title-text">{pzSubTab.tab_name}</span>
        </h4>
      </div>
      <div className={"pz-custom-item-body"}>
        <PromizeAttribute pzSubTab={pzSubTab} {...props} />
      </div>
    </div>
  );
}