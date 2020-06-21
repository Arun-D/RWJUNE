class PromizeOption extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        pzActiveDropdown : ''
    }

    pzSetActiveOptionHandler = (tabId, tabAttrId, attrValueId, pzOptionAttrValue) => {
        const { pzActiveOptions, pzProductPrice, pzCustomizer, pzCanvas, pzCanvasObject, pzCurrentView, pzQuantity } = this.props;
        let pzPrice = pzProductPrice
        if (pzActiveOptions[tabId] == undefined) {
            pzActiveOptions[tabId] = []
        }

        let oldPrice = pzActiveOptions[tabId].length > 0 ? pzCustomizer.attributeOptions[pzActiveOptions[tabId][0]][pzActiveOptions[tabId][1]].promize_attribute_value.option_price : 0
        if (oldPrice) {
            if (pzOptionAttrValue.option_price) {
                pzPrice = parseFloat(pzPrice) - parseFloat(oldPrice * pzQuantity);
                pzPrice = parseFloat(pzPrice) + parseFloat(pzOptionAttrValue.option_price *pzQuantity);
            } else {
                pzPrice = parseFloat(pzPrice) - parseFloat(oldPrice * pzQuantity);
            }
        } else if (pzOptionAttrValue && pzOptionAttrValue.option_price) {
            pzPrice = parseFloat(pzPrice) + parseFloat(pzOptionAttrValue.option_price * pzQuantity);
        }
        let subTabs = pzCustomizer.subtabs[tabId] ? pzCustomizer.subtabs[tabId] : {};
        if (Object.keys(subTabs).length > 0 && Object.keys(pzActiveOptions).length > 0) {
            Object.keys(pzActiveOptions).map((option) => {
                let activeObj = subTabs[option];
                let canvasObj = pzCanvas.getItemByField('tabId', parseInt(option));
                if (activeObj && canvasObj) {
                    pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
                    delete pzCanvasObject[pzCurrentView][canvasObj.name]
                    delete pzActiveOptions[option]
                }
            })
        }
        pzActiveOptions[tabId][0] = tabAttrId;
        pzActiveOptions[tabId][1] = attrValueId;
        pzActiveOptions[tabId][2] = pzOptionAttrValue.option_code;
        this.props.HomeComponent.setState({ pzActiveOptions, pzProductPrice: pzPrice, pzCanvasObject }, () => {
            this.props.HomeComponent.pzApplyRules()
        });
    }
    componentWillMount() {
        let { pzDefaultOptions, pzOptions, pzActiveOptions, pzApplyOptions, pzCustomizer, pzTab } = this.props
        if (pzDefaultOptions.length > 0 && Object.keys(pzActiveOptions).length == 0) {
            const pzOptionArray = Array.from(Object.keys(pzOptions), k => pzOptions[k]);
            let matched = pzDefaultOptions.filter(o => !pzOptionArray.find(o2 => { o.promize_tab_attribute_values_id === o2.promize_tab_attribute_values_id }))
            if (matched.length > 0) {
                matched.map((option, index) => {
                    let optionObj = {
                        ...option,
                        ...pzCustomizer.tabs[option.promize_tab_id]
                    }
                    this.pzChangeHandler(undefined, optionObj);
                })
            }

        } else if (pzApplyOptions.length > 0) {
            pzApplyOptions.map((opt_id, index) => {
                let matchedOption = pzOptions[opt_id]
                this.pzChangeHandler(matchedOption)
            })
            this.props.HomeComponent.setState({ pzApplyOptions: [] })
        }
    }
    componentDidUpdate(){
        let { pzDefaultOptions, pzOptions, pzActiveOptions, pzApplyOptions, pzCustomizer } = this.props;
        if (pzDefaultOptions.length > 0 && Object.keys(pzActiveOptions).length == 0) {
            const pzOptionArray = Array.from(Object.keys(pzOptions), k => pzOptions[k]);
            console.log("========didupdate====", pzOptionArray)
            let matched = pzDefaultOptions.filter(o => !pzOptionArray.find(o2 => { o.promize_tab_attribute_values_id === o2.promize_tab_attribute_values_id }))
            if (matched.length > 0) {
                matched.map((option, index) => {
                    let optionObj = {
                        ...option,
                        ...pzCustomizer.tabs[option.promize_tab_id]
                    }
                    this.pzChangeHandler(undefined, optionObj);
                })
            }

        }
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (!event.target.classList.contains('option')) {
            this.setState({ 'pzActiveDropdown': '' })
        }
    }

    pzHandleReplaceOptions = (pzReplaceOptions) => {
        pzReplaceOptions.map((option) => {
            this.pzChangeHandler(undefined, option)
        })
    }
    pzSelectHandler = (e, value) =>{
        e.preventDefault();
        this.setState({pzActiveDropdown : value})
    }

    pzChangeHandler = (params, pzOptionProperty) => {
        if (params || pzOptionProperty) {
            const { pzCanvas, pzImgUrl, pzCanvasObject, pzActiveOptions, pzBaseType, pzCustomizer, pzReplaceImg, pzCrossOrigin, InstallationData, nextPageData } = this.props;
            let { pzCurrentView } = this.props
            const tabData = this.props.pzSubTab ? this.props.pzSubTab : this.props.pzTab
            if (!pzOptionProperty) {
                pzOptionProperty = { ...tabData, ...params }
            }
            if (params != undefined && pzOptionProperty.default_view && pzOptionProperty.default_view != this.props.pzCurrentView) {
                pzCurrentView = pzOptionProperty.default_view
                this.props.HomeComponent.setState({ "pzCurrentView": pzOptionProperty.default_view }, () => {
                    this.props.HomeComponent.pzReloadCanvasObjects();
                })
            }
            let pzOptionAttrValue = pzOptionProperty.promize_attribute_value;
            if(nextPageData){
                InstallationData[tabData.tab_name] = [pzOptionAttrValue.option_name, pzOptionAttrValue.option_price];            }
            
            let additionalData = pzOptionProperty.additional_data ? JSON.parse(pzOptionProperty.additional_data) : {}
            if (Object.keys(additionalData).length > 0 && additionalData.replaceModel && params != undefined) {
                let replaceOptions = [];
                Object.keys(pzActiveOptions).length > 0 && Object.keys(pzActiveOptions).map((option) => {
                    let tabOptions = pzCustomizer.attributeOptions[pzActiveOptions[option][0]];
                    let optCodeToReplace = pzActiveOptions[option][2] ? pzActiveOptions[option][2].replace(pzBaseType, pzOptionAttrValue.option_value) : null;
                    if (optCodeToReplace && tabOptions) {
                        let canvasObj = pzCanvas.getItemByField('tabAttrId', pzActiveOptions[option][0]);
                        if (canvasObj) {
                            pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
                            delete pzCanvasObject[pzCurrentView][canvasObj.name]
                            delete pzActiveOptions[canvasObj.tabAttrId]
                        }
                        let attributeVal = pzCustomizer.attributes[option]
                        Object.values(attributeVal).map((attr)=>{
                            let attributeOptions = pzCustomizer.attributeOptions[attr.promize_tab_attribute_id]
                            let optionToApply = Object.keys(attributeOptions).find(key => attributeOptions[key].promize_attribute_value.option_code === optCodeToReplace)
                            if(optionToApply){
                                let optionObj = {
                                    ...attributeOptions[optionToApply],
                                    ...pzCustomizer.tabs[option]
                                }
                                optionToApply && replaceOptions.push(optionObj)
                            }
                        })
            //             let optionToApply = Object.keys(tabOptions).find(key => tabOptions[key].promize_attribute_value.option_code === optCodeToReplace);
            //             let optionObj = {
            //                 ...tabOptions[optionToApply],
            //                 ...pzCustomizer.tabs[option]
            //             }
            //             optionToApply && replaceOptions.push(optionObj)
                    } else if (pzOptionProperty.promize_tab_id != option && tabOptions) {
                        let optionToApply = Object.keys(tabOptions).find(key => tabOptions[key].promize_tab_attribute_values_id === parseInt(pzActiveOptions[option][1]));
                        let optionObj = {
                            ...tabOptions[optionToApply],
                            ...pzCustomizer.tabs[option]
                        }
                        optionToApply && replaceOptions.push(optionObj)
                    }
                })
                this.props.HomeComponent.setState({ pzBaseType: pzOptionAttrValue.option_value }, () => {
                    if (replaceOptions.length > 0) {
                        this.pzHandleReplaceOptions(replaceOptions)
                    }
                });
            }else if(Object.keys(additionalData).length > 0 && additionalData.applyColorTo && additionalData.applyColorFrom && parseInt(additionalData.applyColorFrom) === parseInt(pzOptionProperty.promize_tab_attribute_id)){
                let tab_id =  additionalData.applyColorTo
                var canvasObject = pzCanvas.getItemByName("FObject_option_" + tab_id);
                if(canvasObject){
                    this.props.HomeComponent.setState({pzCanvasLoader : true})
                    let OptionColorCode = (pzOptionAttrValue.option_value && pzOptionAttrValue.option_value.charAt(0) == '#' && pzCheckValidColorCode(pzOptionAttrValue.option_value)) ? pzOptionAttrValue.option_value
                : (pzCheckValidColorCode('#' + pzOptionAttrValue.option_value))
                    ? ('#' + pzOptionAttrValue.option_value) : '';
                    canvasObject.filterColor = OptionColorCode
                    pzApplyColorToObject(pzCanvas, canvasObject, pzCrossOrigin, this.props.HomeComponent)
                    this.pzSetActiveOptionHandler(pzOptionProperty.promize_tab_id, pzOptionProperty.promize_tab_attribute_id, pzOptionProperty.promize_tab_attribute_values_id, pzOptionAttrValue);
                }
                return false
            }
            this.pzSetActiveOptionHandler(pzOptionProperty.promize_tab_id, pzOptionProperty.promize_tab_attribute_id, pzOptionProperty.promize_tab_attribute_values_id, pzOptionAttrValue);
            const pzAttrOptionColorCode = (pzOptionAttrValue.option_value && pzOptionAttrValue.option_value.charAt(0) == '#' && pzCheckValidColorCode(pzOptionAttrValue.option_value)) ? pzOptionAttrValue.option_value
                : (pzCheckValidColorCode('#' + pzOptionAttrValue.option_value))
                    ? ('#' + pzOptionAttrValue.option_value) : '';
            let pzObject = '';
            pzOptionProperty['colorCode'] = pzAttrOptionColorCode;
            pzOptionProperty['optionValue'] = pzOptionAttrValue.option_value;
            let objectImages = {};
            let ObjectType = '';
            if (pzOptionProperty.option_images) {
                const pzParsedTabAttrImages = (pzOptionProperty.option_images) ? JSON.parse(pzOptionProperty.option_images) : {};
                const pzTabAttrImages = this.pzGetTabAttrOptionImages(pzOptionAttrValue.promize_images, pzParsedTabAttrImages);
                objectImages = pzTabAttrImages;
                ObjectType = 'image';
                if (pzOptionProperty.colorCode || (pzTabAttrImages && Object.keys(pzTabAttrImages).length == 0)) {
                    if (pzOptionProperty.tab_images) {
                        let parsedTabImages = (pzOptionProperty.tab_images) ? JSON.parse(pzOptionProperty.tab_images) : '';
                        objectImages = parsedTabImages;
                        ObjectType = 'color';
                    }
                }
            } else if (pzOptionProperty.colorCode) {
                if (pzOptionProperty.tab_images) {
                    let parsedTabImages = (pzOptionProperty.tab_images) ? JSON.parse(pzOptionProperty.tab_images) : '';
                    objectImages = parsedTabImages;
                    ObjectType = 'color';
                }
            }
            Object.keys(pzCanvasObject).length &&
                Object.keys(pzCanvasObject).map(objectViewId => {
                    const loadOptionImage = (Object.keys(objectImages).length > 0 && objectImages[objectViewId]) ? pzImgUrl.concat(objectImages[objectViewId].replace(pzReplaceImg, '')) : '';
                    pzOptionProperty['src'] = loadOptionImage;
                    pzObject = pzCreateCanvasObject(objectViewId, ObjectType, pzOptionProperty, pzCanvas, pzCurrentView, pzCrossOrigin, this.props.HomeComponent)
                    if (objectViewId == pzCurrentView && pzOptionProperty['src']) {
                        this.props.HomeComponent.setState({pzCanvasLoader : true})
                        pzAddObjectToCanvas(pzCanvas, pzObject, pzCrossOrigin, this.props.HomeComponent)
                    }
                    (ObjectType == 'image' || ObjectType == 'color') ? (pzOptionProperty['src'] ? pzCanvasObject[objectViewId][pzObject.name] = pzObject : '') : pzCanvasObject[objectViewId][pzObject.name] = pzObject;
                    //this.props.HomeComponent.pzUpdateHistoryStack(pzObject);
                })
            this.props.HomeComponent.setState({ pzCanvasObject });
        }
    }

    pzGetTabAttrOptionImages = (attrImages, tabAttrImages) => {
        const pzTabAttrOptImages = {}
        if (Object.keys(tabAttrImages).length > 0) {
            Object.keys(tabAttrImages).map(optionImageViewId => {
                if (tabAttrImages[optionImageViewId]) {
                    let image_val = attrImages.find((val) => {
                        return parseInt(val.promize_images_id) == parseInt(tabAttrImages[optionImageViewId])
                    })
                    if (image_val) {
                        pzTabAttrOptImages[optionImageViewId] = image_val.image_url;
                    }
                }
            });
            return pzTabAttrOptImages;
        }
    };

    render() {
        return (
            <React.Fragment>
                {<PZOption {...this.props} {...this.state} pzSelectHandler={this.pzSelectHandler} clickHandler={this.pzChangeHandler} />}
            </React.Fragment>
        );
    }
}