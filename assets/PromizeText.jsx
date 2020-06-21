class PromizeText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pzSettings: {
                1: 0, //scale (1-Yes, 0.-No)
                2: 0, //rotate text (1-Yes, 0-No)
                3: 0, //remove text (1-Yes, 0-No)
                4: [], // enable color (1- color code, 2.color pallete)
                5: 1, //long character (1-hide, 2.stop, 3-error, 4-next line, 5.limit char, 6-reduce size)
                6: 1, //repetition(1.none, 2.basic, 3.half brick, 4.half drop, 5.Mirror)
                7: 0, //apply to all views (1-Yes, 0-No)
                8: 0, //add smilies (1-Yes, 0-No)
                9: 0,  //have default controls (1-Yes, 0-No)
                10: 1, //Show boundary (1-Yes, 0-No)
                11: 0, //showTextOutsideBoundary (1-Yes, 0-No)
                12: 0, //selectable (1-Yes, 0.-No)
                13: 1, //center text  (1-Yes, 0.-No)
            },
            showFont: false,
            showFontSize: false,
            showFontColorForMobile: false,
            showFontStyleForMobile: false,
            showFontAlignForMobile: false,
            textProperty: { 1: { 'fontWeight': 'normal', 'fontStyle': 'normal', 'textDecoration': 'none' } },
            showBoundary: 0,
            showSelectBoundary: 1,
            textselectable: true,
            textBoundaryControls: true,
            textCenterBoundary: 1,
        }
    }

    componentWillMount() {
        let { pzAttribute } = this.props
        let { pzSettings } = this.state
        let pzAttributeSettings = pzAttribute.promize_attribute.promize_attribute_settings;
        if (pzAttributeSettings.length > 0) {
            Object.keys(pzSettings).map((ref_id, setting_index) => {
                if (ref_id == 4) {
                    let selectedObject = pzAttributeSettings.filter((val) => {
                        return val.promize_setting.reference_id == ref_id
                    })
                    selectedObject.length > 0 && selectedObject.map((data) => {
                        if (!pzSettings[ref_id].includes(data.promize_setting.reference_value)) {
                            pzSettings[ref_id].push(data.promize_setting.reference_value)
                        }
                    })
                } else {
                    let selectedObject = pzAttributeSettings.find((val) => {
                        return val.promize_setting.reference_id == ref_id
                    })
                    pzSettings[ref_id] = selectedObject ? selectedObject.promize_setting.reference_value : pzSettings[ref_id]
                }
            })
        }
        this.setState({pzSettings})
        //this.pzDefaultProperties()
    }

    // componentDidUpdate(){
    //     let { pzActiveTexts, pzTexts } = this.props
        
    // }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (!event.target.classList.contains('active')) {
            this.setState({ 'showFontSize': false, showFont: false, showFontColorForMobile: false, showFontStyleForMobile: false, showFontAlignForMobile: false })
        }
    }

    changePickerColor = (selected, attributeDetail, pzSettings) => {
        this.pzTextProperty('fill', selected, attributeDetail, pzSettings)
    }

    pzDefaultProperties = () => {
        let { pzActiveTexts, pzTexts } = this.props
        let pzTextDetail = pzTexts.promize_attribute_text_value;
        let textSetting = this.props.pzCustomizer.attributeDomainTexts;
        let pzTextSetting = {};
        if (pzActiveTexts[pzTexts.promize_tab_text_attribute_values_id] == undefined) {
            pzActiveTexts[pzTexts.promize_tab_text_attribute_values_id] = {}
        }
        if(Object.keys(pzActiveTexts[pzTexts.promize_tab_text_attribute_values_id]).length > 0){
            let textValues = pzActiveTexts[pzTexts.promize_tab_text_attribute_values_id]
            pzTextSetting['fontFamily'] = textValues.fontFamily;
            pzTextSetting['fontFamilyFile'] = textValues.fontFamilyFile;
            pzTextSetting['fontSize'] = textValues.fontSize;
            pzTextSetting['fill'] = textValues.fill;
            pzTextSetting['textAlign'] = textValues.textAlign;
            pzTextSetting['fontWeight'] = textValues.fontWeight;
            pzTextSetting['textDecoration'] = textValues.textDecoration;
            pzTextSetting['fontStyle'] = textValues.fontStyle;
            pzTextSetting['text'] = textValues.text;
            pzTextSetting['Originaltext'] = textValues.Originaltext;
            pzTextSetting['price'] = textValues.option_price
            pzTextSetting['priceAdded'] = true
        }else{
            pzTextSetting['fontFamily'] = pzTextDetail.default_font_family ? textSetting['fontFamilies'][pzTextDetail.default_font_family].font_name : 'Arial';
            pzTextSetting['fontFamilyFile'] = pzTextDetail.default_font_family ? textSetting['fontFamilies'][pzTextDetail.default_font_family].font_file : 'Arial.tiff';
            pzTextSetting['fontSize'] = pzTextDetail.default_font_size ? textSetting['fontSizes'][pzTextDetail.default_font_size].font_size : 25;
            pzTextSetting['fill'] = pzTextDetail.default_color ? textSetting['fontColor'][pzTextDetail.default_color].font_color_code : '#000';
            pzTextSetting['textAlign'] = pzTextDetail.default_text_align ? textSetting['textAligns'][pzTextDetail.default_text_align].text_align_name : 'center';
            pzTextSetting['fontWeight'] = pzTextDetail.default_font_shape ? textSetting['fontShapes'][pzTextDetail.default_font_shape].font_shape_name : 'normal';
            pzTextSetting['textDecoration'] = 'none';
            pzTextSetting['fontStyle'] = 'normal';
            pzTextSetting['text'] = pzTexts.default_text ? pzTexts.default_text : '';
            pzTextSetting['Originaltext'] = pzTexts.default_text ? pzTexts.default_text : '';
            pzTextSetting['price'] = pzTextDetail.text_price ? pzTextDetail.text_price : 0
            pzTextSetting['priceAdded'] = false
        }
        pzActiveTexts[pzTexts.promize_tab_text_attribute_values_id] = pzTextSetting
        this.props.HomeComponent.setState({ pzActiveTexts })
    }

    pzTextProperty = (property, value, pzTextDetail, pzSettings, fontfile) => {
        let { pzCanvas, pzCurrentView, pzCanvasObject, pzActiveTexts, pzCrossOrigin, pzProductPrice, pzQuantity } = this.props;
        let tabData = this.props.pzSubTab ? this.props.pzSubTab : this.props.pzTab
        let pzDefaultProperty = pzActiveTexts[pzTextDetail.promize_tab_text_attribute_values_id]
        let textBoundary = pzTextDetail.boundary_position ? JSON.parse(pzTextDetail.boundary_position) : {};
        if (tabData.default_view && tabData.default_view != pzCurrentView) {
            pzCurrentView = tabData.default_view
            this.props.HomeComponent.setState({ "pzCurrentView": tabData.default_view }, () => {
                this.props.HomeComponent.pzReloadCanvasObjects();

            })
        }
        let viewsToApply = []
        pzDefaultProperty[property] = value;
        if (property == 'text') {
            pzDefaultProperty['Originaltext'] = value
            if(value == '' && pzDefaultProperty['price']){
                pzProductPrice = pzProductPrice - (pzDefaultProperty['price'] * pzQuantity)
                pzDefaultProperty['priceAdded'] = false
            }else if(value.length == 1 && !pzDefaultProperty['priceAdded']){
                pzProductPrice = pzProductPrice + (pzDefaultProperty['price'] * pzQuantity)
                pzDefaultProperty['priceAdded'] = true
            }
        } else if (property == 'fontFamily') {
            pzDefaultProperty['fontFamilyFile'] = fontfile ? fontfile : 'Arial.tiff';
            this.pzShowFont();
        }
        else if (property == 'fontSize') {
            this.pzShowFontSize();
        }
        else if (property == 'fill') {
            this.pzShowFontColorForMobile(false);
        }
        pzActiveTexts[pzTextDetail.promize_tab_text_attribute_values_id] = pzDefaultProperty
        if (pzSettings[7]) {
            Object.keys(pzCanvasObject).map((view_id) => {
                viewsToApply.push(view_id)
            })
        } else {
            viewsToApply.push(pzCurrentView)
        }
        if (Object.keys(textBoundary).length > 0) {
            viewsToApply.map((view_id) => {
                if (textBoundary[view_id]) {
                    textBoundary[view_id].map((boundary, index) => {
                        let pzObjectParams = { boundary: boundary, index: index, ...pzTextDetail, ...pzDefaultProperty, ...tabData, pzSettings: pzSettings }
                        pzObjectParams['property'] = property;

                        let pzObject = pzCreateCanvasObject(view_id, 'text', pzObjectParams, pzCanvas, pzCurrentView, pzCrossOrigin, this.props.HomeComponent);
                        if (property == 'textAlign') {
                            value == 'left' ? pzObject.left = boundary.left : (value == 'right' ? pzObject.left = (boundary.left + (boundary.width - pzObject.textWidth)) : (value == 'center' ? pzObject.left = boundary.left + (boundary.width - pzObject.width) / 2 : pzObject.left = pzObject.left))
                            this.pzShowFontAlignForMobile(false);
                        }
                        (view_id == pzCurrentView) && pzAddObjectToCanvas(pzCanvas, pzObject, pzCrossOrigin)
                        pzCanvasObject[view_id][pzObject.name] = pzObject;
                        this.props.HomeComponent.pzUpdateHistoryStack(pzObject);
                    })
                } else {
                    let pzObjectParams = { ...pzDefaultProperty, [property]: value }
                    pzObjectParams['property'] = property;
                    pzActiveTexts[pzTextDetail.promize_tab_text_attribute_values_id] = pzObjectParams
                }
            })
            this.props.HomeComponent.setState({ pzCanvasObject, pzActiveTexts, pzProductPrice })
        } else {
            let pzObjectParams = { ...pzDefaultProperty, [property]: value }
            pzObjectParams['property'] = property;
            pzActiveTexts[pzTextDetail.promize_tab_text_attribute_values_id] = pzObjectParams
            this.props.HomeComponent.setState({ pzActiveTexts })
        }
    }

    pzShowFont = () => {
        this.setState({ showFont: !this.state.showFont })
    }

    pzShowFontSize = () => {
        this.setState({ showFontSize: !this.state.showFontSize })
    }
    pzShowFontColorForMobile = (status) => {
        this.setState({ showFontColorForMobile: status })
    }
    pzShowFontAlignForMobile = (status) => {
        this.setState({ showFontAlignForMobile: status })
    }
    pzShowFontStyleForMobile = (status) => {
        this.setState({ showFontStyleForMobile: status })
    }
    pzTextShapes = (property, value, pzTextDetail, pzSettings, activeClass) => {
        if (value == 'bold') {
            property = 'fontWeight'
            value = (activeClass == 'active') ? 'normal' : 'bold'
        } else if (value == 'italic') {
            property = 'fontStyle';
            value = (activeClass == 'active') ? 'normal' : 'italic'
        } else if (value == 'underline') {
            property = 'textDecoration';
            value = (activeClass == 'active') ? 'normal' : 'underline'
        }
        this.pzShowFontStyleForMobile(false)
        this.pzTextProperty(property, value, pzTextDetail, pzSettings);
    }

    render() {
        let { pzAttribute, pzActiveTexts, pzTexts } = this.props
        let { pzSettings } = this.state
        if(pzActiveTexts[pzTexts.promize_tab_text_attribute_values_id] == undefined){
            this.pzDefaultProperties()
        }
      
        return (
            <React.Fragment>
                <PZText TextComponent={this} {...this.props} pzDomainText={this.props.pzCustomizer.attributeDomainTexts} {...this.state} textComponent={this} changePickerColor={this.changePickerColor} pzSettings={pzSettings} />
            </React.Fragment>
        );
    }
}
