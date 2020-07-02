class PromizeHome extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        pzCustomizer: {},
        pzCanvas: {},
        pzCurrentView: 1,
        pzTotalViews: 1,
        pzActiveSection: 0,
        pzActiveTab: {},
        pzDefaultOptions: [],
        pzRules: {},
        pzHideTabs: [],
        pzHideAttributes: [],
        pzHideAttributeValues: [],
        pzApplyOptions: [],
        pzActiveOptions: {},
        pzActiveImages: {},
        pzActiveTexts: {},
        pzActiveCliparts: {},
        StaticContent:true,
        InstallationData: {},
        pzCrossOrigin: 'Anonymous',
        pzApiUrl: 'https://live.productimize.com/promizenode/',
        pzImgUrl: 'https://images.productimize.com/',
        pzIconsPath: 'https://live.productimize.com/promizetemplate/',
        pzReplaceImg: './assets/',
        // pzReplaceImg: '',
        // pzApiUrl: 'https://devcloud.productimize.com/v3/promizenode/',
        // pzImgUrl: 'https://devcloud.productimize.com/v3/promizenode/',
        // pzIconsPath : 'https://devcloud.productimize.com/Promize-Template1/',
        pzECommerceProductId: (document.getElementById('web_product_id')) ? document.getElementById('web_product_id').value : (window.demoProductId),
        pzStoreHash: (document.getElementById('shop_name')) ? document.getElementById('shop_name').value : (window.shop_name),
        pzPlatform: (document.getElementById('platform')) ? document.getElementById('platform').value : (window.platform),
        pzEditId: window.editId,
        pzLoading: false,
        pzCanvasObject: {},
        fullScreen: false,
        nextPageData: false,
        generalSettings: {},
        pzBasePrice: (document.querySelector("meta[property='og:price:amount']")) ? parseFloat(document.querySelector("meta[property='og:price:amount']").getAttribute("content").replace(",", "")) : (document.querySelector("meta[property='product:price:amount']")) ? parseFloat(document.querySelector("meta[property='product:price:amount']").getAttribute("content").replace(",", "")) : 0,
        pzProductPrice: (document.querySelector("meta[property='og:price:amount']")) ? parseFloat(document.querySelector("meta[property='og:price:amount']").getAttribute("content").replace(",", "")) : (document.querySelector("meta[property='product:price:amount']")) ? parseFloat(document.querySelector("meta[property='product:price:amount']").getAttribute("content").replace(",", "")) : 0,
        pzBaseType: '',
        pzPageLoader: true,
        pzCanvasLoader: false,
        pzQuantity: 1,
        pzPopup: false,
        pzDomainSettings: {
            1: 0, //zoom,
            2: 0, // full screen,
            3: 0, //undo redo,
            4: 0, //share
            5: 0, //save for later
            6: 0, //download
            7: 0, //add to cart
            8: 0, //start over
            9: 0, //quantity
            10: 0, //price
            11: 'grey' //boundary color
        }
    };
    pzHistoryStack = {
        past: [],
        present: [],
        future: [],
    };

    componentWillMount() {
        var window_url = new URL(window.location);
                var editid = window_url.searchParams.get("door_inputs")

        console.log(editid)
        let { pzCustomizer, pzActiveSection, pzActiveTab, pzActiveOptions, pzActiveImages, pzActiveTexts, pzRules, pzEditId, pzProductPrice, pzQuantity, pzDomainSettings } = this.state;
        fetch(this.state.pzApiUrl + 'getProductDetailWithAttributes', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ store_hash: this.state.pzStoreHash, product_id: parseInt(this.state.pzECommerceProductId) })
        })
            .then(res => res.json())
            .then(response => {
                if (response.status == 400) {
                    alert('Check your request params');
                    this.setState({ pzPageLoader: false })
                    return false
                }
                pzCustomizer.product = response.product.promize_customizer;
                var pzSectionsDefault = pzCustomizer.product.promize_sections;

                var pzSections = pzSectionsDefault.length >0 && pzSectionsDefault.filter((val)=>{
                if(val.section_description != "nextstep"){
                return val;
                }
                })
                // var pzSections = pzCustomizer.product.promize_sections;
                pzCustomizer.sections = {}
                pzCustomizer.tabs = {}
                pzSections.length > 0 && pzSections.map((section, sect_index) => {
                    pzActiveSection = (sect_index == 0) ? section.promize_section_id : pzActiveSection;
                    pzCustomizer.sections[section.promize_section_id] = section;
                    var promizeTabs = section.promize_tabs
                    promizeTabs.length > 0 && promizeTabs.map((tab, tab_idex) => {
                        if (tab.is_default_tab || tab_idex == 0) {
                            pzActiveTab[section.promize_section_id] = tab.promize_tab_id;
                        } else if (pzActiveTab[section.promize_section_id] == undefined) {
                            pzActiveTab[section.promize_section_id] = tab.promize_tab_id;
                        }
                        pzCustomizer.tabs[tab.promize_tab_id] = tab
                        pzCustomizer.attributes = {}
                        pzCustomizer.attributeOptions = {}
                        pzCustomizer.attributeTexts = {}
                        pzCustomizer.attributeImages = {};
                        pzCustomizer.attributeCliparts = {};
                        pzCustomizer.subtabs = {}
                        pzCustomizer.attributeDomainTexts = {};
                    })
                    if (pzSections.length == (sect_index + 1)) {
                        pzActiveSection = Object.keys(pzCustomizer.sections)[0];
                        this.setState({ "pzCustomizer": pzCustomizer, "pzActiveSection": pzActiveSection, "pzLoading": true, 'pzPageLoader': true }, () => {
                            var canvasside = new fabric.Canvas('pz_preview_image', { preserveObjectStacking: true, enableRetinaScaling: false });
                            this.setState({ pzCanvas: canvasside }, () => {
                                this.pzSetBaseImage();
                                pzInitializeFCanvas(this)
                            });
                        });
                    }
                }) 
                //Get General Settings
                fetch(this.state.pzApiUrl + 'getDomainSettings/?domain_id=' + pzCustomizer.product.domain_id)
                    .then(res => res.json())
                    .then(response => {
                        var generalSettings = response.domain_settings;
                        let commonSettings = generalSettings.filter((val) => {
                            return val.settings_type == 'common'
                        })
                        if (commonSettings.length > 0) {
                            Object.keys(pzDomainSettings).map((ref_id, setting_index) => {
                                if (ref_id == 11) {
                                    let selectedObject = commonSettings.find((val) => {
                                        return val.promize_settings[0].reference_id == ref_id
                                    })
                                    pzDomainSettings[ref_id] = selectedObject ? selectedObject.promize_settings[0].reference_name : pzDomainSettings[ref_id]
                                } else {
                                    let selectedObject = commonSettings.find((val) => {
                                        return val.promize_settings[0].reference_id == ref_id
                                    })
                                    pzDomainSettings[ref_id] = selectedObject ? selectedObject.promize_settings[0].reference_value : pzDomainSettings[ref_id]
                                }
                            })
                        }
                        this.setState({ generalSettings, pzDomainSettings });
                    })
                    .catch(err => {
                        // handle errors
                    });


                //Get Rules getProductRules
                fetch(this.state.pzApiUrl + 'getProductRules/?id=' + pzCustomizer.product.promize_customizer_id)
                    .then(res => res.json())
                    .then(response => {
                        pzRules = response.product_rules
                        this.setState({ pzRules }, () => {
                            this.pzApplyRules()
                        });
                    })
                    .catch(err => {
                        // handle errors
                    });
                if (pzEditId) {
                    fetch(this.state.pzApiUrl + 'getSaveForLater', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify({ id: pzEditId })
                    })
                        .then(res => res.json())
                        .then(response => {
                            let pzPrice = pzProductPrice
                            let options = response.records ? JSON.parse(response.records.selected_options) : {};
                            Object.keys(options).length > 0 && Object.keys(options).map((viewId, index) => {
                                let selected = options[viewId];
                                Object.keys(selected).length > 0 && Object.keys(selected).map((selected_object, index) => {
                                    if (selected[selected_object].customType == 'option' && selected[selected_object].tabId && selected[selected_object].tabAttrValueId) {
                                        if (pzActiveOptions[selected[selected_object].tabId] == undefined) {
                                            pzActiveOptions[selected[selected_object].tabId] = []
                                        }
                                        pzActiveOptions[selected[selected_object].tabId][0] = selected[selected_object].tabAttrId
                                        pzActiveOptions[selected[selected_object].tabId][1] = selected[selected_object].tabAttrValueId
                                    } else if (selected[selected_object].customType == 'uploadimage' && selected[selected_object].tabAttrValueId) {
                                        selected[selected_object].clipTo = pzCliping(selected[selected_object
                                        ]);
                                        if (pzActiveImages[selected[selected_object].tabAttrValueId] == undefined) {
                                            pzActiveImages[selected[selected_object].tabAttrValueId] = []
                                        }
                                        pzActiveImages[selected[selected_object].tabAttrValueId].push([selected[selected_object].resizedImage, selected[selected_object].removedWhiteImage, selected[selected_object].removeWhite])
                                    } else if (selected[selected_object].customType == 'text') {
                                        let fileType = selected[selected_object].fontFamilyFile.split('.')
                                        var newStyle = document.createElement('style');
                                        newStyle.appendChild(document.createTextNode("\
                                          @font-face {\
                                          font-family: " + selected[selected_object].fontFamily + ";\
                                          src: url('https://live.productimize.com/promizenode/assets/fonts/"+ selected[selected_object].fontFamilyFile + "')  format(" + fileType[1] + ");\
                                          }\
                                          "));
                                        document.head.appendChild(newStyle);
                                        pzActiveTexts[selected[selected_object].tabAttrValueId] = selected[selected_object]

                                        selected[selected_object].clipTo = pzCliping(selected[selected_object
                                        ]);
                                    }
                                    if (selected[selected_object].option_price) {
                                        pzPrice = parseFloat(pzPrice) + parseFloat(selected[selected_object].option_price);
                                    }
                                })

                            })
                            this.setState({ pzCanvasObject: options, pzActiveOptions, pzActiveImages, pzProductPrice: pzPrice, pzPageLoader: false }, () => {
                                this.pzReloadCanvasObjects();
                            });
                        })
                }

            })
            .catch(err => {
                // handle errors
            });
        if (!pzEditId) {
            fetch(this.state.pzApiUrl + 'getDefaultOptions', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ store_hash: this.state.pzStoreHash, product_id: parseInt(this.state.pzECommerceProductId) })
            })
                .then(res => res.json())
                .then(response => {
                    let pzDefaultOptions = response.defaultOptions, pzPrice = pzProductPrice;
                    pzDefaultOptions.length > 0 && pzDefaultOptions.map((def_opt, index) => {
                        if (def_opt.promize_attribute_value.option_price) {
                            pzPrice = parseFloat(pzPrice) + parseFloat(def_opt.promize_attribute_value.option_price * pzQuantity);
                        }
                    })
                    this.setState({ pzDefaultOptions, pzPageLoader: false, pzProductPrice: pzPrice });
                })
        }

        if(editid)  {
            console.log(editid);
            let doorDetail = JSON.parse(editid);
            console.log(doorDetail);
            console.log(doorDetail['Door 1']);
        }

        

       

    }
    pzSetState = (name, value) => {
        this.setState({ [name]: value });
    }
    pzPopupHandler = (key) => {
        let pzPrice = this.state.pzBasePrice

        if (key == 'cancel') {
            this.setState({ pzPopup: false })
        } else {
            const { pzCanvasObject, pzDefaultOptions, pzApplyOptions, pzQuantity } = this.state;
            (pzCanvasObject) && Object.keys(pzCanvasObject).length > 0 && Object.keys(pzCanvasObject).map((canvasview, index) => {
                var canvasObject = pzCanvasObject[canvasview];
                if (canvasObject && Object.keys(canvasObject).length > 0) {
                    Object.keys(canvasObject).map((obj, index) => {
                        if (obj != 'baseImage' && obj != 'pzOverlayImage') {
                            delete canvasObject[obj];
                        }
                    });
                }
            });
            pzDefaultOptions.length > 0 && pzDefaultOptions.map((def_opt, index) => {
                if (def_opt.promize_attribute_value.option_price) {
                    pzPrice = parseFloat(pzPrice) + parseFloat(def_opt.promize_attribute_value.option_price * pzQuantity);
                }
            })
            this.setState({ pzPopup: false, pzCanvasObject: pzCanvasObject, pzActiveOptions: {}, pzActiveImages: {}, pzActiveTexts: {}, pzProductPrice: pzPrice, pzQuantity: 1, pzApplyOptions }, () => {
                this.pzReloadCanvasObjects();
            })
        }
    }
    pzSetBaseImage = () => {
        let { pzCustomizer, pzImgUrl, pzCurrentView, pzCanvas, pzCanvasObject, pzReplaceImg, pzCrossOrigin } = this.state
        let setBaseImage = pzCustomizer.product.model_image;
        var model_image = JSON.parse(setBaseImage);
        let downloadingImage = null;
        let imgURL = model_image[0].image_url;
        imgURL = pzImgUrl + imgURL.replace(pzReplaceImg, '');

        if (model_image && model_image.length > 0) {
            downloadingImage = imgURL;
            var modelObject = {
                "src": downloadingImage,
                "name": "baseimage",
                "selectable": false,
                "hasControls": false,
                "hasBorders": false,
                'crossOrigin': pzCrossOrigin,
                "layerno": -1,
                type: "image"
            }
            Object.keys(pzCustomizer).length > 0 && model_image.map((modeview, view_index) => {
                let imgURL = modeview.image_url;
                imgURL = pzImgUrl + imgURL.replace(pzReplaceImg, '');
                let baseImage = imgURL;
                //let baseImage = pzImgUrl + modeview.image_url;
                if (pzCanvasObject[modeview.id] == undefined) {
                    pzCanvasObject[modeview.id] = {}
                }
                pzCanvasObject[modeview.id]['baseImage'] = Object.assign({}, { ...modelObject }, { 'src': baseImage, 'crossOrigin': pzCrossOrigin });
                if (pzCustomizer.product.overlay_details) {
                    var pzOverlayDetails = JSON.parse(pzCustomizer.product.overlay_details);
                    if (pzOverlayDetails[modeview.id]) {
                        pzCanvasObject[modeview.id]['pzOverlayImage'] = {
                            ...pzOverlayDetails[modeview.id],
                            "src": pzImgUrl + pzOverlayDetails[modeview.id].url.replace(pzReplaceImg, ''),
                            "name": "pzOverlayImage",
                            "selectable": false,
                            "hasControls": false,
                            "hasBorders": false,
                            'crossOrigin': pzCrossOrigin,
                            "layerno": 20,
                            'type': "image",
                            'evented': false,
                            'hasRotatingPoint': false,
                            'centeredScaling': true,
                        }
                    }
                }
            })
            //this.setState({ 'pzCurrentView': model_image[0].id, pzTotalViews: model_image.length, pzCanvasObject });
            this.setState({ pzCurrentView: parseInt(model_image[0].id), pzTotalViews: model_image.length, pzCanvasObject }, () => {
                this.pzReloadCanvasObjects();
            });
        }

    }

    // pzStatic = ()=>{
    //     this.setState({StaticContent : false})
        
    // }

    pzSetSelectedTab = (tabId, tabData) => {
        const { pzActiveTab, pzActiveSection, pzCurrentView } = this.state;
        let currView = (tabData && tabData.default_view && tabData.default_view != pzCurrentView) ? tabData.default_view : pzCurrentView

        if (pzActiveTab[pzActiveSection] == tabId) {
            pzActiveTab[pzActiveSection] = '';
        } else {
            pzActiveTab[pzActiveSection] = tabId;
        }
        this.setState({ pzActiveTab, pzCurrentView: currView }, () => {
            (tabData && tabData.default_view && tabData.default_view != pzCurrentView) && this.pzReloadCanvasObjects()
        });
    }
    pzOperatorComparison = (post, operator, value) => {
        switch (operator) {
            case '>': return post > value;
            case '<': return post < value;
            case '>=': return post >= value;
            case '<=': return post <= value;
            case '==': return post == value;
            case '!=': return post != value;
            case '===': return post === value;
            case '!==': return post !== value;
            case '&&': return post && value;
            case '||': return post || value;
            case 'includes': return post.includes(value);
            case '!includes': return !post.includes(value);
        }
    }

    pzRuleValue = (key) => {
        switch (key) {
            case 'IS': return 'includes';
            case 'IS NOT': return '!includes';
            case 'INCLUDES': return 'includes';
            case 'DOES NOT INCLUDES': return '!includes';
            case 'IS LESSER THAN': return '<';
            case 'IS GREATER THAN': return '>';
        }
    }

    pzApplyRules = () => {
        let { pzRules, pzActiveOptions, pzApplyOptions, pzCanvas, pzCanvasObject, pzCurrentView } = this.state;
        let pzHideTabs = [], pzHideAttributes = [], pzHideAttributeValues = []
        let allSelectedOptions = [];
        Object.keys(pzActiveOptions).map((key, index) => {
            pzActiveOptions[key] && allSelectedOptions.push(("" + pzActiveOptions[key][1]).toString())
        })
        // Hide the Show actions
        pzRules.length > 0 && pzRules.map((rule, rule_index) => {
            rule.promize_actions.length > 0 && rule.promize_actions.map((action, action_index) => {
                let attribute_values = action.promize_tab_attribute_value_id ? action.promize_tab_attribute_value_id.split(',') : [];
                let tab = action.promize_tab_id ? action.promize_tab_id : undefined
                let tab_attribute = action.promize_tab_attribute_id ? action.promize_tab_attribute_id : undefined
                let action_value = action.promize_setting.reference_name;
                if (action_value == 'SHOW') {
                    attribute_values.length > 0 && attribute_values.map((val, index) => {
                        pzHideAttributeValues.push(parseInt(val));
                    })
                    tab_attribute && attribute_values.length == 0 && pzHideAttributes.push(tab_attribute);
                    tab && tab_attribute == undefined && attribute_values.length == 0 && pzHideTabs.push(tab);
                }
            })
        })
        //console.log("allSelectedOptions", allSelectedOptions)

        //Apply rules if conditions get staisfied
        pzRules.length > 0 && pzRules.map((rule, rule_index) => {
            let rule_condition = rule.rule_condition_id == 1 ? '&&' : '||';
            let rule_value = rule.rule_value_id == 3 ? true : false;
            let checked_conditions = []
            rule.promize_conditions.length > 0 && rule.promize_conditions.map((condition, condition_index) => {
                let attribute_values = condition.promize_tab_attribute_value_id ? condition.promize_tab_attribute_value_id.split(',') : [];
                let tab = condition.promize_tab_id ? condition.promize_tab_id : undefined
                let tab_attribute = condition.promize_tab_attribute_id ? condition.promize_tab_attribute_id : undefined
                let condition_value = this.pzRuleValue(condition.promize_setting.reference_name);
                let checked_value = false;
                if (attribute_values) {
                    let isValueSelected = allSelectedOptions.some(value => attribute_values.includes(value))
                    checked_value = (condition_value == 'includes') ? (isValueSelected ? true : false) : (isValueSelected ? false : true)
                } else if (tab_attribute) {
                    let selectedval = pzActiveOptions[tab_attribute];
                    checked_value = this.pzOperatorComparison(attribute_values, condition_value, ("" + selectedval).toString());
                }
                checked_conditions.push(checked_value)
            })

            let applyAction = false
            if (rule_condition == '&&' && rule_value) {
                applyAction = checked_conditions.includes(false) ? false : true
            } else if (rule_condition == '&&' && !rule_value) {
                applyAction = checked_conditions.includes(true) ? true : false
            } else if (rule_condition == '||' && rule_value) {
                applyAction = checked_conditions.includes(true) ? true : false
            } else if (rule_condition == '||' && !rule_value) {
                applyAction = checked_conditions.includes(false) ? true : false
            }
            //console.log("applyAction",applyAction )
            if (applyAction) {
                rule.promize_actions.length > 0 && rule.promize_actions.map((action, action_index) => {
                    let attribute_values = action.promize_tab_attribute_value_id ? action.promize_tab_attribute_value_id.split(',') : [];
                    let tab = action.promize_tab_id ? action.promize_tab_id : undefined
                    let tab_attribute = action.promize_tab_attribute_id ? action.promize_tab_attribute_id : undefined
                    let action_value = action.promize_setting.reference_name;
                    if (action_value == 'HIDE') {
                        if (attribute_values.length > 0) {
                            attribute_values.map((val, index) => {
                                pzHideAttributeValues.push(parseInt(val));
                            })
                        } else if (tab_attribute) {
                            pzHideAttributes.push(tab_attribute);
                        } else if (tab) {
                            pzHideTabs.push(tab);
                        }

                    } else if (action_value == 'APPLY') {
                        if (tab && tab_attribute && attribute_values.length > 0) {
                            pzActiveOptions[tab] == undefined && attribute_values.map((val, index) => {
                                pzApplyOptions.push(parseInt(val));
                            })
                            pzActiveOptions[tab] != undefined && pzActiveOptions[tab][0] != tab_attribute && attribute_values.map((val, index) => {
                                pzApplyOptions.push(parseInt(val));
                            })
                        }
                    } else if (action_value == 'SHOW') {
                        if (attribute_values.length > 0) {
                            let filteredTabAttributeValues = attribute_values.filter((obj) => { return pzHideAttributeValues.indexOf(parseInt(obj)) == -1; });
                            pzHideAttributeValues = filteredTabAttributeValues
                        } else if (tab_attribute) {
                            let filteredTabAttributes = pzHideAttributes.filter((value) => {
                                return value != tab_attribute;
                            });
                            pzHideAttributes = filteredTabAttributes
                        } else if (tab) {
                            let filteredTabs = pzHideTabs.filter((value) => {
                                return value != tab;
                            });
                            pzHideTabs = filteredTabs
                        };
                    }
                })
            }
        })

        //Remove from canvas
        pzHideTabs.length > 0 && pzHideTabs.map((tab_id) => {
            let canvasObj = pzCanvas.getItemByField('tabId', tab_id);
            if (canvasObj) {
                pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
                delete pzCanvasObject[pzCurrentView][canvasObj.name]
                delete pzActiveOptions[canvasObj.tabId]
            }
        })
        pzHideAttributes.length > 0 && pzHideAttributes.map((tabAttrId) => {
            let canvasObj = pzCanvas.getItemByField('tabAttrId', tabAttrId);
            if (canvasObj) {
                pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
                delete pzCanvasObject[pzCurrentView][canvasObj.name]
                delete pzActiveOptions[canvasObj.tabAttrId]
            }
        })
        pzHideAttributeValues.length > 0 && pzHideAttributeValues.map((tabAttrValueId) => {
            let canvasObj = pzCanvas.getItemByField('tabAttrValueId', tabAttrValueId);
            if (canvasObj) {
                pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
                delete pzCanvasObject[pzCurrentView][canvasObj.name]
                delete pzActiveOptions[canvasObj.tabAttrValueId]
            }
        })
        this.setState({ pzHideTabs, pzHideAttributes, pzHideAttributeValues, pzApplyOptions, pzActiveOptions, pzCanvas, pzCanvasObject })
    }

    pzSetNextPage(){
        this.setState({StaticContent : false, nextPageData: true})
        let { pzCustomizer, pzActiveSection, pzActiveTab, pzActiveOptions, pzActiveImages, pzActiveTexts, pzRules, pzEditId, pzProductPrice, pzQuantity, pzDomainSettings } = this.state;
        fetch(this.state.pzApiUrl + 'getProductDetailWithAttributes', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ store_hash: this.state.pzStoreHash, product_id: parseInt(this.state.pzECommerceProductId) })
        })
            .then(res => res.json())
            .then(response => {
                if (response.status == 400) {
                    alert('Check your request params');
                    this.setState({ pzPageLoader: false })
                    return false
                }
                pzCustomizer.product = response.product.promize_customizer;
                var pzSectionsDefault = pzCustomizer.product.promize_sections;
                
                var pzSections =  pzSectionsDefault.length >0 && pzSectionsDefault.filter((val)=>{
                    if(val.section_description == "nextstep"){
                        return val;
                    }
                })
                pzCustomizer.sections = {}
                pzCustomizer.tabs = {}
                pzSections.length > 0 && pzSections.map((section, sect_index) => {
                    pzActiveSection = (sect_index == 0) ? section.promize_section_id : pzActiveSection;
                    pzCustomizer.sections[section.promize_section_id] = section;
                    var promizeTabs = section.promize_tabs
                    promizeTabs.length > 0 && promizeTabs.map((tab, tab_idex) => {
                        if (tab.is_default_tab || tab_idex == 0) {
                            pzActiveTab[section.promize_section_id] = tab.promize_tab_id;
                        } else if (pzActiveTab[section.promize_section_id] == undefined) {
                            pzActiveTab[section.promize_section_id] = tab.promize_tab_id;
                        }
                        pzCustomizer.tabs[tab.promize_tab_id] = tab
                        pzCustomizer.attributes = {}
                        pzCustomizer.attributeOptions = {}
                        pzCustomizer.attributeTexts = {}
                        pzCustomizer.attributeImages = {};
                        pzCustomizer.attributeCliparts = {};
                        pzCustomizer.subtabs = {}
                        pzCustomizer.attributeDomainTexts = {};
                    })
                    if (pzSections.length == (sect_index + 1)) {
                        pzActiveSection = Object.keys(pzCustomizer.sections)[0];
                        this.setState({ "pzCustomizer": pzCustomizer, "pzActiveSection": pzActiveSection, "pzLoading": true, 'pzPageLoader': true }, () => {
                            var canvasside = new fabric.Canvas('pz_preview_image', { preserveObjectStacking: true, enableRetinaScaling: false });
                            this.setState({ pzCanvas: canvasside }, () => {
                                this.pzSetBaseImage();
                                pzInitializeFCanvas(this)
                            });
                        });
                    }
                })
                //Get General Settings
                fetch(this.state.pzApiUrl + 'getDomainSettings/?domain_id=' + pzCustomizer.product.domain_id)
                    .then(res => res.json())
                    .then(response => {
                        var generalSettings = response.domain_settings;
                        let commonSettings = generalSettings.filter((val) => {
                            return val.settings_type == 'common'
                        })
                        if (commonSettings.length > 0) {
                            Object.keys(pzDomainSettings).map((ref_id, setting_index) => {
                                if (ref_id == 11) {
                                    let selectedObject = commonSettings.find((val) => {
                                        return val.promize_settings[0].reference_id == ref_id
                                    })
                                    pzDomainSettings[ref_id] = selectedObject ? selectedObject.promize_settings[0].reference_name : pzDomainSettings[ref_id]
                                } else {
                                    let selectedObject = commonSettings.find((val) => {
                                        return val.promize_settings[0].reference_id == ref_id
                                    })
                                    pzDomainSettings[ref_id] = selectedObject ? selectedObject.promize_settings[0].reference_value : pzDomainSettings[ref_id]
                                }
                            })
                        }
                        this.setState({ generalSettings, pzDomainSettings });
                    })
                    .catch(err => {
                        // handle errors
                    });


                //Get Rules getProductRules
                fetch(this.state.pzApiUrl + 'getProductRules/?id=' + pzCustomizer.product.promize_customizer_id)
                    .then(res => res.json())
                    .then(response => {
                        pzRules = response.product_rules
                        this.setState({ pzRules }, () => {
                            this.pzApplyRules()
                        });
                    })
                    .catch(err => {
                        // handle errors
                    });
                if (pzEditId) {
                    fetch(this.state.pzApiUrl + 'getSaveForLater', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify({ id: pzEditId })
                    })
                        .then(res => res.json())
                        .then(response => {
                            let pzPrice = pzProductPrice
                            let options = response.records ? JSON.parse(response.records.selected_options) : {};
                            Object.keys(options).length > 0 && Object.keys(options).map((viewId, index) => {
                                let selected = options[viewId];
                                Object.keys(selected).length > 0 && Object.keys(selected).map((selected_object, index) => {
                                    if (selected[selected_object].customType == 'option' && selected[selected_object].tabId && selected[selected_object].tabAttrValueId) {
                                        if (pzActiveOptions[selected[selected_object].tabId] == undefined) {
                                            pzActiveOptions[selected[selected_object].tabId] = []
                                        }
                                        pzActiveOptions[selected[selected_object].tabId][0] = selected[selected_object].tabAttrId
                                        pzActiveOptions[selected[selected_object].tabId][1] = selected[selected_object].tabAttrValueId
                                    } else if (selected[selected_object].customType == 'uploadimage' && selected[selected_object].tabAttrValueId) {
                                        selected[selected_object].clipTo = pzCliping(selected[selected_object
                                        ]);
                                        if (pzActiveImages[selected[selected_object].tabAttrValueId] == undefined) {
                                            pzActiveImages[selected[selected_object].tabAttrValueId] = []
                                        }
                                        pzActiveImages[selected[selected_object].tabAttrValueId].push([selected[selected_object].resizedImage, selected[selected_object].removedWhiteImage, selected[selected_object].removeWhite])
                                    } else if (selected[selected_object].customType == 'text') {
                                        let fileType = selected[selected_object].fontFamilyFile.split('.')
                                        var newStyle = document.createElement('style');
                                        newStyle.appendChild(document.createTextNode("\
                                          @font-face {\
                                          font-family: " + selected[selected_object].fontFamily + ";\
                                          src: url('https://live.productimize.com/promizenode/assets/fonts/"+ selected[selected_object].fontFamilyFile + "')  format(" + fileType[1] + ");\
                                          }\
                                          "));
                                        document.head.appendChild(newStyle);
                                        pzActiveTexts[selected[selected_object].tabAttrValueId] = selected[selected_object]

                                        selected[selected_object].clipTo = pzCliping(selected[selected_object
                                        ]);
                                    }
                                    if (selected[selected_object].option_price) {
                                        pzPrice = parseFloat(pzPrice) + parseFloat(selected[selected_object].option_price);
                                    }
                                })

                            })
                            this.setState({ pzCanvasObject: options, pzActiveOptions, pzActiveImages, pzProductPrice: pzPrice, pzPageLoader: false }, () => {
                                this.pzReloadCanvasObjects();
                            });
                        })
                }

            })
            .catch(err => {
                // handle errors
            });
        if (!pzEditId) {
            fetch(this.state.pzApiUrl + 'getDefaultOptions', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ store_hash: this.state.pzStoreHash, product_id: parseInt(this.state.pzECommerceProductId) })
            })
                .then(res => res.json())
                .then(response => {
                    let pzDefaultOptions = response.defaultOptions, pzPrice = pzProductPrice;
                    pzDefaultOptions.length > 0 && pzDefaultOptions.map((def_opt, index) => {
                        if (def_opt.promize_attribute_value.option_price) {
                            pzPrice = parseFloat(pzPrice) + parseFloat(def_opt.promize_attribute_value.option_price * pzQuantity);
                        }
                    })
                    this.setState({ pzDefaultOptions, pzPageLoader: false, pzProductPrice: pzPrice });
                })
        }

    }

    pzReloadCanvasObjects = () => {
        let pzCanvas = pzLoadCanvasObjects({ ...this.state })
        this.setState({ pzCanvas, pzPageLoader: false })
    }

    pzObjectProperty = (pzObject) => {
        var pzObjectId = pzObject.name.split('_');
        var pzCanvasObject = this.state.pzCanvasObject;
        if (pzObjectId && pzObjectId[2] && pzObjectId[3]) {
            pzCanvasObject[this.state.pzCurrentView][pzObject.name] = Object.assign({}, pzCanvasObject[this.state.pzCurrentView][pzObject.name], { 'left': pzObject.left, 'top': pzObject.top, 'scaleX': pzObject.scaleX, 'scaleY': pzObject.scaleY, 'angle': pzObject.angle });
            this.setState({ pzCanvasObject })
        }
    }

    pzFCanvasUploadImageAnimation = (imgObj, pzCanvas, scaleVal = 0.05, maxSacaleVal = 0.5) => {
        setTimeout(function animate() {
            imgObj.scaleX = imgObj.scaleX + scaleVal;
            imgObj.scaleY = imgObj.scaleY + scaleVal;
            pzCanvas.renderAll();
            if (imgScaleX <= maxSacaleVal) {
                setTimeout(animate, 50);
            }
        }, 50);
    }

    pzToggleFullScreen = () => {
        this.setState({ fullScreen: !this.state.fullScreen })
    }

    pzUpdateHistoryStack = (obj) => {
        const { past, present } = { ...this.pzHistoryStack };
        var newArray = [];
        if (Object.keys(past).length > 0) {
            newArray.push(...past);
            if (Object.keys(present).length > 0) {
                newArray.push(...present);
            }
            if (newArray) {
                this.pzHistoryStack['past'] = [...newArray];
            }
        }
        else if (Object.keys(present).length > 0) {
            this.pzHistoryStack['past'] = [...present];
        }
        this.pzHistoryStack['present'] = [{ ...obj }];
    }
    pzUndoRedoHandler = (type) => {
        const { past, present, future } = { ...this.pzHistoryStack };
        switch (type) {
            case 'UNDO':
                if (present.length <= 0) {
                    return false;
                }
                const previous = (past) && (past.length > 0) ? past[past.length - 1] : '';
                let newPast = (past) && (past.length > 0) ? past.slice(0, past.length - 1) : '';
                const mergedArray = [...present, ...future];
                const newObj = {
                    past: newPast,
                    present: (previous) ? [{ ...previous }] : [],
                    future: [...mergedArray]
                }
                this.pzHistoryStack = { ...newObj }
                if (Object.keys(present[0]).length > 0 || Object.keys(previous).length > 0) {
                    this.pzUpdateCanvasObject(present[0], previous);
                }
                break;
            case 'REDO':
                if (future.length <= 0) {
                    return false;
                }
                const next = future[0]
                const newFuture = future.slice(1)
                const redoObj = {
                    past: [...past, ...present],
                    present: [{ ...next }],
                    future: newFuture
                }
                this.pzHistoryStack = { ...redoObj }
                this.pzCreateCanvasObject(future[0])

        }

    }
    pzUpdateCanvasObject = (obj, prevObj) => {
        let { pzCanvasObject } = this.state;
        let loopCounter = 0;
        let canvasObjectLength = Object.keys(pzCanvasObject).length;

        if (obj) {

            Object.keys(pzCanvasObject).map((canvasObj, canvasObjIdx) => {
                let currCanvasObj = { ...pzCanvasObject[canvasObj] };
                if (currCanvasObj[obj.name]) {
                    delete currCanvasObj[obj.name];
                    pzCanvasObject[canvasObj] = { ...currCanvasObj };
                }
                loopCounter++;
            });

            if (loopCounter == canvasObjectLength) {
                if (prevObj) {
                    this.pzCreateCanvasObject(prevObj, pzCanvasObject)
                }
                else {
                    this.setState({ pzCanvasObject }, () => {
                        this.pzReloadCanvasObjects();
                    });
                }
            }
        }
    }

    pzCreateCanvasObject = (params, pzCanvasObject = this.state.pzCanvasObject) => {
        const tabAttrOptionImages = params.tabAttrImages;
        const pzImgUrl = this.state.pzImgUrl;

        let pzOptionImageObj = {};
        const parsedOptionPos = (params.optImgPos) ? JSON.parse(params.optImgPos) : '';
        let loopCounter = 0;

        (tabAttrOptionImages) &&
            Object.keys(tabAttrOptionImages).length > 0 &&
            Object.keys(tabAttrOptionImages).map(optionImageViewId => {
                if (!pzCanvasObject[optionImageViewId][params.name]) {
                    pzCanvasObject[optionImageViewId][params.name] = {};
                }
                const optionPosition = (optionImageViewId in parsedOptionPos) ? parsedOptionPos[optionImageViewId] : '';
                const imageUrl = (tabAttrOptionImages[optionImageViewId]) ? pzImgUrl.concat(tabAttrOptionImages[optionImageViewId].replace(this.state.pzReplaceImg, '')) : '';
                pzOptionImageObj = {
                    "type": "image",
                    "name": params.name,
                    "src": imageUrl,
                    "layerno": (params.layerNo) ? params.layerNo : 1,
                    "width": (optionPosition && optionPosition['width ']) ? parseFloat(optionPosition['width']) : 0,
                    "height": (optionPosition && optionPosition['height']) ? parseFloat(optionPosition['height']) : 0,
                    "left": 0, //(optionPosition && optionPosition['left']) ? optionPosition['left'] : 0,
                    "top": 0, //(optionPosition && optionPosition['top']) ? optionPosition['top'] : 0,
                    "scaleX": (optionPosition && optionPosition['scaleX']) ? optionPosition['scaleX'] : 1,
                    "scaleY": (optionPosition && optionPosition['scaleY']) ? optionPosition['scaleY'] : 1,
                    "angle": (optionPosition) ? optionPosition['angle'] : 0,
                    "tabCode": '',
                    "optionCode": '',
                    "selectable": false,
                    "hasControls": false,
                    "hasBorders": false,
                    "opacity": 1,
                    "crossOrigin": this.state.pzCrossOrigin,
                };
                pzCanvasObject[optionImageViewId][params.name][0] = Object.assign({}, { ...pzOptionImageObj, 'opacity': 1 });
                loopCounter++;
            });
        if (loopCounter == Object.keys(tabAttrOptionImages).length) {
            this.setState({ pzCanvasObject }, () => {
                this.pzReloadCanvasObjects();
            });
        }
    }
    pzCreateCanvasImages = async (pzSelectedObj) => {
        var pzThumbCanvas = document.getElementsByClassName("pz-thumbnail-item");
        let savedImgCount = 0;
        const pzImageUrl = this.state.pzImgUrl;
        const pzReplaceImg = this.state.pzReplaceImg;
        pzThumbCanvas = Object.keys(pzThumbCanvas).length > 0 ? pzThumbCanvas : document.getElementsByClassName("canvas-container");
        if ( this.state.pzTotalViews == 1 && pzThumbCanvas.length > 1){
            pzThumbCanvas = pzThumbCanvas[pzThumbCanvas.length - 1]
        }
        const cartObj = {}
        let pzCanvasDataUrl = pzThumbCanvas.firstChild.toDataURL();
        if (pzCanvasDataUrl) {
            var pzSelectedObject = { ...pzSelectedObj.cartObject };
            var pzImageData = { ...pzSelectedObj.imageProperty };
            let savedCanvasImg = await this.pzSaveCanvasImageByDataUrl(pzCanvasDataUrl);
            let viewName = pzThumbCanvas.textContent;
            let viewId;
            let thumbIndex =  1;
            viewId = 'View ' + thumbIndex;
            cartObj["CustomImage"] = pzImageUrl + savedCanvasImg.replace(pzReplaceImg, '');
            pzSelectedObject = { ...pzSelectedObject, ...cartObj };
            pzImageData[viewId]['customImage'] = pzImageUrl + savedCanvasImg.replace(pzReplaceImg, '');
            return { pzSelectedObject, pzImageData };
        }
    } 
    pzSaveCanvasImageByDataUrl = async (canvasDataUrl = null) => {
        //e.preventDefault();

        // let pzCanvasObjects = {};
        let imagedata = {};
        // var image = (canvasDataUrl) ? canvasDataUrl : '';document.getElementById('three-container').toDataURL('image/png');
        imagedata.src = canvasDataUrl;
        const pzAPIURL = this.state.pzApiUrl;

        var saveForLaterResponse = await fetch(pzAPIURL + "convertCanvasToImage", {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(imagedata),
            method: "POST",
        });
        var response = await saveForLaterResponse.json();
        return response.filePath;

    }

    addAllItems = (array) => {
        Shopify.queue = [];
          var quantity = 1 ;
          var newArray = array;
          for (var i = 0; i < newArray.length; i++) {
            product = newArray[i]
            Shopify.queue.push({
              variantId: product,
            });
              }
          Shopify.moveAlong = function() {
          // If we still have requests in the queue, let's process the next one.
          if (Shopify.queue.length) {
            var request = Shopify.queue.shift();
          aa = '{"color":"red","size": "medium"}'
         test = JSON.parse(a)
          data1  = Object.entries(test).map(([key, value]) => data[key] = value)
    
    
          $.ajax({
            url: "/cart/add.js",
            type: "POST",
            dataType: "json",
            data: { quantity: qty, id: variantid, properties: (pzSelectedObjects) },
            success: function (res) {
                fetch(pzAPIURL + 'saveCartProperty', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({ cart_item_id: res.id, domain_id: pzCustomizer.product.domain_id, custom_properties: pzImageData })
                })
                    .then(res => res.json())
                    .then(response => {
                        console.log("===response===", response)
                        Shopify.moveAlong();
                        quantity += 1;
                    });
                window.location.href = "/cart";
            },
            error: function () {
                alert("Sorry something went wrong..");
                if (Shopify.queue.length){
                    Shopify.moveAlong()
                  }
            },
            complete: function () {
                pzSetState('pzPageLoader', false);
            }
        })
    
            
            }
         
           };
        Shopify.moveAlong();
      };

    pzAddToCart = () => {
        this.setState({ 'pzPageLoader': true });
        let data = {};
        let variantid = document.getElementById("variant_id") ? document.getElementById("variant_id").value : '';
        const qty = document.getElementById('pz-qty-field').value

        let { pzCanvasObject, pzBasePrice, pzProductPrice, pzActiveOptions, pzCustomizer, pzApiUrl, InstallationData } = this.state
        let selectedObject = pzGetSelectedValuesForCart(pzCanvasObject, pzBasePrice, pzProductPrice, pzActiveOptions, pzCustomizer);
        const pzSetState = this.pzSetState;
        const pzAPIURL = this.state.pzApiUrl;
        if (selectedObject) {
            this.pzCreateCanvasImages(selectedObject).then(function (pzSelectedArrObjects) {
                var cartData = {};
                debugger;
                var pzImageData = { ...selectedObject.imageProperty, ...pzSelectedArrObjects.pzImageData };
                Object.keys(pzImageData).map((data, index) => {
                    var arrData = pzSelectedArrObjects.pzSelectedObject;
                    Object.keys(arrData).map((obj, idx) => {
                        if (arrData[obj] == pzImageData[data]["customImage"]) {
                            cartData[obj] = arrData[obj]
                        }
                    })
                })
                var pzSelectedObjects = { ...cartData, ...selectedObject.cartObject }
                var installationVal = {}
                Object.keys(InstallationData).map((data, index)=>{
                    installationVal[data]=InstallationData[data][0]
                })
                pzSelectedObjects = { ...pzSelectedObjects, ...installationVal}
                delete pzSelectedObjects.price
                // $.ajax({
                //     url: "/cart/add.js",
                //     type: "POST",
                //     dataType: "json",
                //     data: { quantity: qty, id: variantid, properties: (pzSelectedObjects) },
                //     success: function (res) {
                //         fetch(pzAPIURL + 'saveCartProperty', {
                //             headers: {
                //                 'Accept': 'application/json',
                //                 'Content-Type': 'application/json'
                //             },
                //             method: "POST",
                //             body: JSON.stringify({ cart_item_id: res.id, domain_id: pzCustomizer.product.domain_id, custom_properties: pzImageData })
                //         })
                //             .then(res => res.json())
                //             .then(response => {
                //                 console.log("===response===", response)
                //             });
                //         window.location.href = "/cart";
                //     },
                //     error: function () {
                //         alert("Sorry something went wrong..");
                //     },
                //     complete: function () {
                //         pzSetState('pzPageLoader', false);
                //     }
                // })
                // neew code
              let  a=[5327238496416,5318684442784]
                addAllItems(a)
                        })
                        //newcode end
        } else {
            pzSetState('pzPageLoader', false);
            alert("No item is selected. Please select some items before hit add to cart")
        }
    }
    render() {
        return (
            <React.Fragment>
                <PZHome HomeComponent={this} {...this.state} />
                {/* {((this.state.pzLoading && (Object.keys(this.state.pzCustomizer).length > 0)) ? (<PZHome HomeComponent={this} {...this.state} />) : (''))} */}
            </React.Fragment>
        );
    }
}

ReactDOM.render(<PromizeHome />, document.getElementById('root'));


 

  