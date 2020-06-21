class PromizeAttribute extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let tabdata = this.props.pzSubTab ? this.props.pzSubTab : this.props.pzTab
        let tabAttributes = this.props.pzCustomizer.attributes[tabdata.promize_tab_id] ? this.props.pzCustomizer.attributes[tabdata.promize_tab_id] : {};
        if (Object.keys(tabAttributes).length == 0) {
            this.pzGetAttributeValues()
        }
    }

    pzGetAttributeValues = () => {
        let pzTab = this.props.pzSubTab ? this.props.pzSubTab : this.props.pzTab
        var pzTabAttributes = pzTab.promize_tab_attributes;
        let pzCustomizer = this.props.pzCustomizer;
        let pzActiveCliparts = this.props.pzActiveCliparts;
        let pzClipartImg = this.props.pzClipartImg;
        //let pzDefaultOptions = this.props.pzDefaultOptions;
        let pzDomainId = pzCustomizer.product.domain_id;
        pzTabAttributes.length > 0 && pzTabAttributes.map((pzAttribute, index) => {
            if (!pzCustomizer.attributes[pzTab.promize_tab_id]) {
                pzCustomizer.attributes[pzTab.promize_tab_id] = {}
            }
            pzCustomizer.attributes[pzTab.promize_tab_id][pzAttribute.promize_tab_attribute_id] = pzAttribute;
            if (pzAttribute.promize_attribute) {
                var attributeType = pzAttribute.promize_attribute.attribute_type;
                var tabAttributeId = pzAttribute.promize_tab_attribute_id;
                if (attributeType == "option") {
                    fetch(this.props.pzApiUrl + 'getAttributesValues/?id=' + tabAttributeId)
                        .then(res => res.json())
                        .then(response => {
                            response.option_attributes.length > 0 && response.option_attributes.map((attribute_value, attribute_value_idex) => {
                                if (pzCustomizer.attributeOptions[tabAttributeId] == undefined) {
                                    pzCustomizer.attributeOptions[tabAttributeId] = {}
                                }
                                pzCustomizer.attributeOptions[tabAttributeId][attribute_value.promize_tab_attribute_values_id] = attribute_value;

                                attribute_value.promize_sub_tabs.length > 0 && attribute_value.promize_sub_tabs.map((subTab, subTabIdx) => {
                                    if (pzCustomizer.attributeOptions[tabAttributeId][attribute_value.promize_tab_attribute_values_id]['promizeSubTabs'] == undefined) {
                                        pzCustomizer.attributeOptions[tabAttributeId][attribute_value.promize_tab_attribute_values_id]['promizeSubTabs'] = {}
                                    }
                                    pzCustomizer.attributeOptions[tabAttributeId][attribute_value.promize_tab_attribute_values_id]['promizeSubTabs'][subTab.child_tab_id] = subTab;
                                    if (pzCustomizer.subtabs[pzTab.promize_tab_id] == undefined) {
                                        pzCustomizer.subtabs[pzTab.promize_tab_id] = {}
                                    }
                                    pzCustomizer.subtabs[pzTab.promize_tab_id][subTab.child_tab_id] = subTab
                                })
                            })

                            this.props.HomeComponent.setState({ pzCustomizer });
                        })
                }
                else if (attributeType == "text") {
                    if (Object.keys(pzCustomizer.attributeDomainTexts).length == 0) {
                        fetch(this.props.pzApiUrl + 'getDomainTextSettings/?id=' + pzDomainId)
                            .then(res => res.json())
                            .then(response => {
                                pzCustomizer.attributeDomainTexts['fontColor'] = {};
                                pzCustomizer.attributeDomainTexts['fontFamilies'] = {};
                                pzCustomizer.attributeDomainTexts['fontShapes'] = {};
                                pzCustomizer.attributeDomainTexts['fontSizes'] = {};
                                pzCustomizer.attributeDomainTexts['textAligns'] = {};
                                response.font_colors.length > 0 && response.font_colors.map((attribute_font_colors) => {
                                    pzCustomizer.attributeDomainTexts['fontColor'][attribute_font_colors.promize_font_color_id] = attribute_font_colors
                                })
                                response.font_families.length > 0 && response.font_families.map((attribute_font_family) => {
                                    let fileType = attribute_font_family.font_file.split('.')
                                    var newStyle = document.createElement('style');
                                    newStyle.appendChild(document.createTextNode("\
                                  @font-face {\
                                  font-family: " + attribute_font_family.font_name + ";\
                                  src: url('https://live.productimize.com/promizenode/assets/fonts/"+ attribute_font_family.font_file + "') ;\
                                  }\
                                  "));
                                    document.head.appendChild(newStyle);
                                    pzCustomizer.attributeDomainTexts['fontFamilies'][attribute_font_family.font_id] = attribute_font_family
                                })
                                response.font_shapes.length > 0 && response.font_shapes.map((attribute_font_shapes) => {
                                    pzCustomizer.attributeDomainTexts['fontShapes'][attribute_font_shapes.font_shape_id] = attribute_font_shapes
                                })
                                response.font_sizes.length > 0 && response.font_sizes.map((attribute_font_sizes) => {
                                    pzCustomizer.attributeDomainTexts['fontSizes'][attribute_font_sizes.font_size_id] = attribute_font_sizes
                                })
                                response.text_aligns.length > 0 && response.text_aligns.map((attribute_text_aligns) => {
                                    pzCustomizer.attributeDomainTexts['textAligns'][attribute_text_aligns.text_align_id] = attribute_text_aligns
                                })
                                this.props.HomeComponent.setState({ pzCustomizer });
                            })
                    }
                    fetch(this.props.pzApiUrl + 'getAttributesTextValues/?id=' + tabAttributeId)
                        .then(res => res.json())
                        .then(response => {
                            response.text_attributes.length > 0 && response.text_attributes.map((attribute_text, attribute_text_index) => {
                                if (pzCustomizer.attributeTexts[tabAttributeId] == undefined) {
                                    pzCustomizer.attributeTexts[tabAttributeId] = {}
                                }
                                pzCustomizer.attributeTexts[tabAttributeId] = attribute_text;
                                pzCustomizer.attributeTexts[tabAttributeId]['attribute_name'] = pzAttribute.promize_attribute['attribute_name'];
                                //pzCustomizer.attributeTexts[tabAttributeId][attribute_text.promize_tab_text_attribute_values_id]['attr_key'] = pzTab.promize_tab_id;

                                // pzDefaultOptions[tabAttributeId] = (attribute_text.default_text) ? attribute_text : '';

                            })
                            this.props.HomeComponent.setState({ pzCustomizer });
                        })
                }
                else if (attributeType == "image") {
                    fetch(this.props.pzApiUrl + 'getAttributesImageValues/?id=' + tabAttributeId)
                        .then(res => res.json())
                        .then(response => {
                            response.image_attributes.length > 0 && response.image_attributes.map((attribute_image, attribute_image_index) => {
                                if (pzCustomizer.attributeImages[tabAttributeId] == undefined) {
                                    pzCustomizer.attributeImages[tabAttributeId] = {}
                                }
                                pzCustomizer.attributeImages[tabAttributeId] = attribute_image
                            })
                            this.props.HomeComponent.setState({ pzCustomizer });
                        })
                }

                else if (attributeType == "clipart") {
                    fetch(this.props.pzApiUrl + 'getAttributesClipartValues/?id=' + tabAttributeId)
                        .then(res => res.json())
                        .then(response => {
                            response.clipart_attributes.length > 0 && response.clipart_attributes.map((attribute_clipart, attribute_clipart_index) => {
                                if (pzCustomizer.attributeCliparts[tabAttributeId] == undefined) {
                                    pzCustomizer.attributeCliparts[tabAttributeId] = {}
                                }
                                const clipartVal = attribute_clipart.promize_attribute_clipart_value
                                const clipCatId = clipartVal.promize_domain_clipart_category_id
                                pzCustomizer.attributeCliparts[tabAttributeId]['clipartCategories'] = []
                                pzCustomizer.attributeCliparts[tabAttributeId][attribute_clipart.promize_tab_clipart_attribute_values_id] = attribute_clipart;
                                {
                                    clipCatId.length > 0 && clipCatId.split(",").sort().map((category_id, index) => {
                                        if (index == 0) {
                                            if (pzActiveCliparts[pzTab.promize_tab_id] == undefined) {
                                                pzActiveCliparts[pzTab.promize_tab_id] = []
                                            }
                                            pzActiveCliparts[pzTab.promize_tab_id][2] = category_id;
                                            this.props.HomeComponent.setState({ pzActiveCliparts });
                                        }
                                        if (category_id) {
                                            fetch(this.props.pzApiUrl + 'getDomainClipartCategory/?id=' + parseInt(category_id))
                                                .then(res => res.json())
                                                .then(response => {
                                                    pzCustomizer.attributeCliparts[tabAttributeId]['clipartCategories'][category_id] = response.cliparts;
                                                    if (index == 0) {
                                                        pzClipartImg = response.cliparts ? response.cliparts[index].promize_clipart_category_images : '';
                                                        this.props.HomeComponent.setState({ pzClipartImg });
                                                    }
                                                    this.props.HomeComponent.setState({ pzCustomizer });
                                                })
                                        }
                                    })
                                }
                            })
                            this.props.HomeComponent.setState({ pzCustomizer });
                        })
                }
            }
        });
    }

    render() {
        let tabdata = this.props.pzSubTab ? this.props.pzSubTab : this.props.pzTab
        let tabAttributes = this.props.pzCustomizer.attributes[tabdata.promize_tab_id] ? this.props.pzCustomizer.attributes[tabdata.promize_tab_id] : {};
        if (Object.keys(tabAttributes).length == 0) {
            this.pzGetAttributeValues()
        }
        return (
            <React.Fragment>
                {Object.keys(tabAttributes).length > 0 && Object.keys(tabAttributes).map((tab_attr, tab_attr_index) => {
                    if (!this.props.pzHideAttributes.includes(parseInt(tab_attr))) {
                        if (this.props.pzCustomizer.attributeOptions[tab_attr]) {
                            return <PromizeOption key={tab_attr_index} tabAttribute={tab_attr} pzOptions={this.props.pzCustomizer.attributeOptions[tab_attr]} pzAttribute={tabAttributes[tab_attr]} {...this.props} />
                        } else if (this.props.pzCustomizer.attributeTexts[tab_attr] && Object.keys(this.props.pzCustomizer.attributeDomainTexts).length > 0) {
                            return <PromizeText key={tab_attr_index} tabAttribute={tab_attr} pzTexts={this.props.pzCustomizer.attributeTexts[tab_attr]} pzAttribute={tabAttributes[tab_attr]} {...this.props} />
                        }
                        else if (this.props.pzCustomizer.attributeImages[tab_attr]) {
                            return <PromizeUploadImage key={tab_attr_index} tabAttribute={tab_attr} pzUploadImage={this.props.pzCustomizer.attributeImages[tab_attr]} pzAttribute={tabAttributes[tab_attr]} {...this.props} />
                        }
                        else if (this.props.pzCustomizer.attributeCliparts[tab_attr]) {
                            return <PromizeClipart key={tab_attr_index} tabAttribute={tab_attr} pzClipart={this.props.pzCustomizer.attributeCliparts[tab_attr]} pzClipartCategory={this.props.pzCustomizer.attributeCliparts[tab_attr]['clipartCategories']} pzAttribute={tabAttributes[tab_attr]} {...this.props} />
                        }
                    }
                }
                )}
            </React.Fragment>
        );
    }
}