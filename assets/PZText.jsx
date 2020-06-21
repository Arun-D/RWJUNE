const PZText = (props) => {
  let pzText = props.pzTexts;
  let pzTextValue = pzText.promize_attribute_text_value;
  let {pzSettings, pzDomainText, pzActiveTexts} = props
  let fontFamilies = ('font_ids' in pzTextValue) ? pzTextValue['font_ids'].split(',') : '';
  let fontSizes = ('font_size_ids' in pzTextValue) ? pzTextValue['font_size_ids'].split(',') : '';
  let textAlign = ('font_align_ids' in pzTextValue) ? pzTextValue['font_align_ids'].split(',') : '';
  let fontColors = ('font_color_ids') ? pzTextValue['font_color_ids'].split(',') : '';
  let textStyles = ('font_shape_ids' in pzTextValue) ? (pzTextValue['font_shape_ids'].split(',')) : '';
  return (
    <React.Fragment>
      {
        <div className="pz-design-item-wrapper">
          <div className="pz-text-control-wrapper">
            <div className="pz-text-item">
              <input type="text" name="" id="pz-text" placeholder={pzText.placeholder} value={pzActiveTexts[pzText.promize_tab_text_attribute_values_id] ? pzActiveTexts[pzText.promize_tab_text_attribute_values_id].text : pzText.default_text} minLength={pzText.min_char} maxLength={pzText.max_char} onChange={(e) => { e.preventDefault(), props.TextComponent.pzTextProperty('text', e.target.value, pzText, pzSettings) }} /> 
            </div>
            <div className="pz-text-decoration-wrapper">

              {/* Font Family */}
              {(fontFamilies.length > 1) &&
                <div className="pz-text-item-font">
                  <label for="pz-text-font">Font</label>
                  <button className="pz-font-family" onClick={(e) => { e.preventDefault(), props.TextComponent.pzShowFont() }}>
                    <span style={{ fontFamily: pzActiveTexts[pzText.promize_tab_text_attribute_values_id].fontFamily }}>{pzActiveTexts[pzText.promize_tab_text_attribute_values_id].fontFamily}</span>
                    <i className="fa fa-caret-down"></i>
                  </button>
                  <ul className={ props.showFont ? "pz-font-family-list active" : "pz-font-family-list"}>
                    {fontFamilies.map((font, index) => {
                      return (<li className="active" onClick={(e) => { e.preventDefault(), props.TextComponent.pzTextProperty('fontFamily', pzDomainText['fontFamilies'][font]['font_name'], pzText, pzSettings, pzDomainText['fontFamilies'][font]['font_file']) }}><span className="active" style={{ fontFamily: pzDomainText['fontFamilies'][font]['font_name'] }}>{pzDomainText['fontFamilies'][font]['font_name']}</span></li>);
                    })}
                  </ul>
                </div>
              }

              {/* Font Size */}
              {(fontSizes.length > 1) &&
                <div className="pz-text-item-size">
                  <label htmlFor="pz-text-font">Size</label>
                  <button className="pz-font-size" onClick={(e) => { e.preventDefault(), props.TextComponent.pzShowFontSize() }}>
                    <span>{pzActiveTexts[pzText.promize_tab_text_attribute_values_id].fontSize}</span>
                    <i className="fa fa-caret-down"></i>
                  </button>
                  <ul className={props.showFontSize ? "pz-font-size-list active" : "pz-font-size-list"}>
                    {fontSizes.map((fontSz) => {
                      return (
                        <li className="active" onClick={(e) => { e.preventDefault(), props.TextComponent.pzTextProperty('fontSize', pzDomainText['fontSizes'][fontSz]['font_size'], pzText, pzSettings) }}>
                          <span className="active">{pzDomainText['fontSizes'][fontSz]['font_size']}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              }

              {/* Text Styles */}
              {(textStyles.length > 1) &&
                <div className="pz-text-style">
                  <label htmlFor="pz-text-font">Style</label>
                  <div className="pz-text-style-btns">
                    <button className="pz-sm-text-style" onClick={(e) => { e.preventDefault(), props.TextComponent.pzShowFontStyleForMobile(true) }}>Aa</button>
                    <div className={`pz-text-style-btn-grp ${(props.showFontStyleForMobile) ? 'active' : ''}`}>
                      {textStyles.map((fontStyle) => {
                        let fontShapeName = pzDomainText['fontShapes'][fontStyle]['font_shape_name'].toLowerCase();
                        let activeClass = '';
                        if (fontShapeName == 'bold') {
                          activeClass = pzActiveTexts[pzText.promize_tab_text_attribute_values_id]['fontWeight'].toLowerCase() == 'bold' ? 'active' : '';
                        }else if (fontShapeName == 'italic') {
                          activeClass = pzActiveTexts[pzText.promize_tab_text_attribute_values_id]['fontStyle'].toLowerCase() == 'italic' ? 'active' : '';
                        }else if (fontShapeName == 'underline') {
                          activeClass = pzActiveTexts[pzText.promize_tab_text_attribute_values_id]['textDecoration'].toLowerCase() == 'underline' ? 'active' : '';
                        }
                        return <button
                          className={activeClass}
                          onClick={(e) => { e.preventDefault(), props.TextComponent.pzTextShapes('fontShape', pzDomainText['fontShapes'][fontStyle]['font_shape_name'].toLowerCase(), pzText, pzSettings, activeClass) }}><i className={`fa fa-${pzDomainText['fontShapes'][fontStyle]['font_shape_name'].toLowerCase()} active`}></i></button>
                      })}
                    </div>
                  </div>
                </div>
              }

              {/* Text Align */}
              {(textAlign.length > 1) &&
                <div className="pz-text-alignment">
                  <label htmlFor="pz-text-font">Alignment</label>
                  <button className="pz-sm-text-align" onClick={(e) => { e.preventDefault(), props.TextComponent.pzShowFontAlignForMobile(true) }}><i className="fa fa-align-left"></i></button>
                  <div className={`pz-text-align-btn-grp ${(props.showFontAlignForMobile) ? 'active' : ''}`}>
                    {textAlign.map((fontAlign) => {
                      let activeClass = pzActiveTexts[pzText.promize_tab_text_attribute_values_id]['textAlign'] == pzDomainText['textAligns'][fontAlign]['text_align_name'].toLowerCase() ? 'active' : '';
                      return <button className={activeClass} onClick={(e) => { e.preventDefault(), props.TextComponent.pzTextProperty('textAlign', pzDomainText['textAligns'][fontAlign]['text_align_name'].toLowerCase(), pzText, pzSettings) }}><i className={`active fa fa-align-${pzDomainText['textAligns'][fontAlign]['text_align_name'].toLowerCase()}`}></i></button>
                    })}
                  </div>
                </div>
              }
            </div> 

            {/* Text Color */}
            <div className="pz-text-color-wrapper">
              <button className={`pz-sm-clr-picker`} onClick={(e) => { e.preventDefault(), props.TextComponent.pzShowFontColorForMobile(true) }}><img src={props.pzIconsPath+"images/clr-picker.png"} alt="Clr-picker" /></button>
              <div className={`pz-text-color-container ${(props.showFontColorForMobile) ? 'active' : ''}`}>
                {(fontColors.length > 1) && 
                  <div className={`pz-text-spec-color`}>
                    <label htmlFor="pz-text-font">Pick Your Color</label>
                    <ul className={`pz-font-color-list ${(props.showFontColorForMobile) ? 'active' : ''}`}>
                      {fontColors.map((fontCol) => {
                        let activeClass = pzActiveTexts[pzText.promize_tab_text_attribute_values_id]['fill'] == pzDomainText['fontColor'][fontCol]['font_color_code'] ? 'active' : ''
                        return (<li className={activeClass} onClick={(e) => { e.preventDefault(), props.TextComponent.pzTextProperty('fill', pzDomainText['fontColor'][fontCol]['font_color_code'], pzText, pzSettings) }}>
                          <div className={`pz-text-color active`} style={{ backgroundColor: pzDomainText['fontColor'][fontCol]['font_color_code'] }}></div></li>)
                      })}
                    </ul>
                  </div>
                }
                { pzSettings[4].includes(2) && 
                  <div className="pz-text-color-picker">
                    <label htmlFor="pz-text-font">Color Picker</label>
                    <div className="pz-clr-wrapper">
                      <div className="pz-clr-pciker">
                        <JsColor {...props} className="pzcolorpicker" value={pzActiveTexts[pzText.promize_tab_text_attribute_values_id].fill} id="pzcolorpicker" onChange={(selected) => { props.changePickerColor(selected, pzText, pzSettings) }} />
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div> 

          </div>
        </div>
      }
    </React.Fragment>
  );
}