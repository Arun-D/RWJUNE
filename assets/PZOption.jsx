const PZOption = (props) => {

  const pzDisplayStyle = { 1: 'square', 2: 'circle', 3: 'radio', 4: 'checkbox', 5: 'select', 6: 'input' };
  const pzOptions = props.pzOptions;
  const pzTabData = props.pzSubTab ? props.pzSubTab : props.pzTab
  const pzTabStyle = (pzTabData.tab_style) ? JSON.parse(pzTabData.tab_style) : '';
  const displayType = (pzDisplayStyle[pzTabStyle.display]) ? pzDisplayStyle[pzTabStyle.display] : 'square';
  return (
    <React.Fragment>
      {
        <div className={(displayType != "select") ? 'pz-design-item-wrapper' : 'pz-custom-dd-cover'}>
          {pzTabStyle.enableAttrName && <p className="pz-design-item-title">{props.pzAttribute.promize_attribute.attribute_name}</p>}

          <ul className={(displayType != "select") ? "pz-design-item-list" : ("pz-custom-dd-list " + props.pzShowOption)}>
            {Object.keys(pzOptions).map((tabOption, option_index) => {
              const pzTabOption = pzOptions[tabOption];
              const pzOptionValue = pzTabOption.promize_attribute_value;
              if (props.pzHideAttributeValues.includes(pzTabOption.promize_tab_attribute_values_id) || (props.pzBaseType && pzOptionValue.option_code && !pzOptionValue.option_code.includes(props.pzBaseType))) {
                return ''
              }
              if (pzTabOption && Object.keys(pzTabOption).length > 0) {
                const pzOptionColorCode = (pzOptionValue.option_value && pzOptionValue.option_value.charAt(0) == '#' && pzCheckValidColorCode(pzOptionValue.option_value)) ? pzOptionValue.option_value : (pzCheckValidColorCode('#' + pzOptionValue.option_value)) ? '#' + pzOptionValue.option_value : '';
                let activeClass = (props.pzActiveOptions[pzTabData.promize_tab_id] && props.pzActiveOptions[pzTabData.promize_tab_id][1] == pzTabOption.promize_tab_attribute_values_id) ? true : false
                let pzOptionThumbImg = '';
                if (pzOptionValue.promize_images && (Object.keys(pzOptionValue.promize_images).length > 0)) {
                  pzOptionThumbImg = pzOptionValue.promize_images.find((val) => {
                    return val.image_type == "option_thubnail_image"
                  })
                }
                pzOptionThumbImg = pzOptionThumbImg ? props.pzImgUrl.concat(pzOptionThumbImg.image_url.replace(props.pzReplaceImg, '')) : '';
                let style = {
                  background: `${pzOptionColorCode} url(${pzOptionThumbImg})`,
                  width: (pzTabStyle && pzTabStyle.width > 0) ? pzTabStyle.width : '40',
                  height: (pzTabStyle && pzTabStyle.height > 0) ? pzTabStyle.height : '40',
                  borderRadius: (pzDisplayStyle[pzTabStyle.display] == 'circle') ? '50%' : '',
                };
                if (displayType == "circle" || displayType == "square") {
                  return (
                    <li key={pzOptionValue.option_id} className={`pz-design-item ${(activeClass) ? 'active' : ''}`} onClick={() => { props.clickHandler(pzTabOption) }}>
                      <div className="pz-design-item-content">
                        {(pzOptionColorCode || pzOptionThumbImg) && <div className="pz-design-item-img" style={style}></div>}
                        <div className="pz-design-item-name">{pzOptionValue.option_name}</div>
                        {(pzOptionValue.option_price) &&
                          <div className="pz-design-item-price">
                            <span>${pzOptionValue.option_price.toFixed(2)}</span>
                          </div>
                        }
                      </div>
                    </li>
                  );
                }
                else if (displayType == "checkbox" || displayType == "radio" || displayType == "input") {
                  return (
                    <li key={pzOptionValue.option_id} className="pz-design-item" onClick={() => { props.clickHandler(pzTabOption) }}>
                      <div className="pz-design-item-content">
                        <input type={displayType} name={pzOptionValue.option_name} checked={activeClass} />
                        <span className="pz-design-item-name">{pzOptionValue.option_name}</span>
                        {(pzOptionValue.option_price) &&
                          <div className="pz-design-item-price">
                            <span>$ {pzOptionValue.option_price.toFixed(2)}</span>
                          </div>
                        }
                      </div>
                    </li>
                  );
                }
                else if (displayType == "select") {
                  return (
                    <li className={activeClass} onClick={() => { props.clickHandler(pzTabOption) }} ><span>{pzOptionValue.option_name}</span></li>
                  );
                }
              }
            })
            }
          </ul>
          {(displayType == "select") ? <button className ="pz-custom-dd" onClick={(e) => { e.preventDefault(), props.OptionComponent.pzShowOption() }}><span>{activeOpt}</span><i className ="fa fa-caret-down"></i></button> : ''}
        </div>
      }
    </React.Fragment>
  );
}