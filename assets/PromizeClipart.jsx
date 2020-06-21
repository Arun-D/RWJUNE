class PromizeClipart extends React.Component{
    constructor(props) {
        super(props);
    }   
    pzSetActiveClipart = (tabId, tabAttrId, attrValueId, clipartType, clipartDetail) => {
        const { pzActiveCliparts, pzProductPrice, pzCustomizer, pzCanvas, pzCanvasObject, pzCurrentView, pzQuantity } = this.props;
        let pzPrice = pzProductPrice;
        let oldPrice = '';
        if (pzActiveCliparts[tabId] == undefined) {
            pzActiveCliparts[tabId] = []
        }
        let activeclipart = pzCustomizer.attributeCliparts[pzActiveCliparts[tabId][0]];
        if (pzActiveCliparts[tabId].length > 0 && activeclipart && activeclipart["clipartCategories"].length > 0 ) {
            let categoryList = activeclipart["clipartCategories"];
            Object.keys(categoryList).map((index) => {
                const categoryImg = categoryList[index][0]["promize_clipart_category_images"];
                Object.keys(categoryImg).map((imgId) => {
                    if(categoryImg[imgId].promize_clipart_category_images_id == pzActiveCliparts[tabId][3]){
                        oldPrice = pzActiveCliparts[tabId].length > 0 ? categoryImg[imgId].clipart_price : 0;
                    }
                })
            })
        }
        if (oldPrice) {
            if (clipartDetail.clipart_price) {
                pzPrice = parseFloat(pzPrice) - parseFloat(oldPrice * pzQuantity);
                pzPrice = parseFloat(pzPrice) + parseFloat(clipartDetail.clipart_price * pzQuantity);
            } 
            // else if(pzClipartAttrValue.clipart_price) {
            //     pzPrice = parseFloat(pzPrice) - parseFloat(oldPrice * pzQuantity);
            //     pzPrice = parseFloat(pzPrice) + parseFloat(pzClipartAttrValue.clipart_price * pzQuantity);
            // }
            else {
                pzPrice = parseFloat(pzPrice) - parseFloat(oldPrice * pzQuantity);
            }
        } else if (clipartDetail && clipartDetail.clipart_price) {
            pzPrice = parseFloat(pzPrice) + parseFloat(clipartDetail.clipart_price * pzQuantity);
        } 
        // else if (pzClipartAttrValue && pzClipartAttrValue.clipart_price) {
        //     pzPrice = parseFloat(pzPrice) + parseFloat(pzClipartAttrValue.clipart_price * pzQuantity);
        // }
        let subTabs = pzCustomizer.subtabs[tabId] ? pzCustomizer.subtabs[tabId] : {};
        if (Object.keys(subTabs).length > 0 && Object.keys(pzActiveCliparts).length > 0) {
            Object.keys(pzActiveCliparts).map((option) => {
                let activeObj = subTabs[option];
                let canvasObj = pzCanvas.getItemByField('tabId', parseInt(option));
                if (activeObj && canvasObj) {
                    pzRemoveObjectFromCanvas(pzCanvas, canvasObj)
                    delete pzCanvasObject[pzCurrentView][canvasObj.name]
                    delete pzActiveCliparts[option]
                }
            })
        }
        pzActiveCliparts[tabId][0] = tabAttrId;
        pzActiveCliparts[tabId][1] = attrValueId;
        if(clipartType == "clipart"){
            pzActiveCliparts[tabId][2] = clipartDetail.promize_domain_clipart_category_id;
            pzActiveCliparts[tabId][3] = clipartDetail.promize_clipart_category_images_id;
        } else {
            pzActiveCliparts[tabId][2] = clipartDetail;
        }
        
        this.props.HomeComponent.setState({ pzActiveCliparts, pzProductPrice: pzPrice, pzCanvasObject }, () => {
            this.props.HomeComponent.pzApplyRules()
        });
    }
    
    pzClipartHandler = (pzClipartProperty, clipartDetail) => {
        let pzClipartImg = '';
        const { pzCanvas, pzImgUrl, pzCanvasObject, pzActiveCliparts, pzBaseType, pzCustomizer, pzReplaceImg, pzCrossOrigin } = this.props;
        let { pzCurrentView } = this.props
        const tabData = this.props.pzSubTab ? this.props.pzSubTab : this.props.pzTab
        if(clipartDetail == "category"){
            Object.keys(pzClipartProperty).map((index) => {
                const childCategory = pzClipartProperty[index].ParentClipart;
                pzClipartImg= pzClipartProperty[index].promize_clipart_category_images;
                if(childCategory){
                    pzClipartImg = pzClipartImg.concat(childCategory.promize_clipart_category_images);
                }
                this.pzSetActiveClipart(tabData.promize_tab_id, '', '', 'category', pzClipartProperty[index].promize_domain_clipart_category_id);
            })
            this.props.HomeComponent.setState({ pzClipartImg });
        }
        else {
            this.props.HomeComponent.setState({pzCanvasLoader : true})
            if (!pzClipartProperty) {
                pzClipartProperty = { ...tabData, ...params }
            }
            Object.keys(pzClipartProperty).map((clipart) => {
                if(clipart != "clipartCategories"){
                let pzClipartOption = pzClipartProperty[clipart];
                pzClipartOption['tabId'] = tabData.promize_tab_id;
                pzClipartOption['tab_name'] = tabData.tab_name;
                pzClipartOption['clipart_name'] = clipartDetail.clipart_name;
                pzClipartOption['clipart_price'] = clipartDetail.clipart_price;
                const imageBoundary = (pzClipartOption.boundary_position) ? JSON.parse(pzClipartOption.boundary_position) : '';
                const { width = 1000, height = 1000 } = (imageBoundary && this.props.pzCurrentView in imageBoundary) ? imageBoundary[pzCurrentView][0] : '';
                if (pzClipartOption.default_view && pzClipartOption.default_view != this.props.pzCurrentView) {
                    pzCurrentView = pzClipartOption.default_view
                    this.props.HomeComponent.setState({ "pzCurrentView": pzClipartOption.default_view }, () => {
                        this.props.HomeComponent.pzReloadCanvasObjects();
                    })
                }
                let pzClipartAttrValue = pzClipartOption.promize_attribute_clipart_value;
                this.pzSetActiveClipart(tabData.promize_tab_id, pzClipartOption.promize_tab_attribute_id, pzClipartOption.promize_tab_clipart_attribute_values_id, 'clipart', clipartDetail);
                let pzObject = '';
                let objectImages = {};
                let ObjectType = '';
                if (clipartDetail.promize_product_clipart_image) {
                    const pzParsedTabAttrImages = this.props.pzImgUrl.concat(clipartDetail.promize_product_clipart_image.replace(pzReplaceImg, ''));
                    objectImages = pzParsedTabAttrImages;
                    ObjectType = 'clipart';
                } else if (clipartDetail.colorCode) {
                    if (clipartDetail.tab_images) {
                        let parsedTabImages = (Clipart.tab_images) ? JSON.parse(Clipart.tab_images) : '';
                        objectImages = parsedTabImages;
                        ObjectType = 'color';
                    }
                }
                Object.keys(pzCanvasObject).length &&
                    Object.keys(pzCanvasObject).map(objectViewId => {
                        if (Object.keys(imageBoundary).length > 0) {
                            const loadClipartImage = this.props.pzImgUrl.concat(clipartDetail.promize_product_clipart_image.replace(pzReplaceImg, ''));
                            imageBoundary[pzCurrentView].map((boundary, index) => {
                                const primaryImage = new Image()
                                primaryImage.src = loadClipartImage
                                primaryImage.onload = (imgSrc) => {
                                    pzClipartOption['src'] = loadClipartImage;
                                    pzClipartOption['boundary'] = boundary;

                                    pzClipartOption['originalWidth'] = (imgSrc && imgSrc.path && imgSrc.path[0] && imgSrc.path[0].width) ? imgSrc.path[0].width : imgSrc.width ? imgSrc.width : (imgSrc.explicitOriginalTarget.width ? imgSrc.explicitOriginalTarget.width : 200);
                                    pzClipartOption['originalHeight'] = (imgSrc && imgSrc.path && imgSrc.path[0] && imgSrc.path[0].height) ? imgSrc.path[0].height : imgSrc.height ? imgSrc.height : (imgSrc.explicitOriginalTarget.height ? imgSrc.explicitOriginalTarget.height : 200);
                                    pzObject = pzCreateCanvasObject(objectViewId, ObjectType, pzClipartOption, pzCanvas, pzCurrentView, pzCrossOrigin, this.props.HomeComponent)
                                    if (objectViewId == pzCurrentView && pzClipartOption['src']) {
                                        pzAddObjectToCanvas(pzCanvas, pzObject, pzCrossOrigin, this.props.HomeComponent)
                                    }
                                    pzCanvasObject[objectViewId][pzObject.name] = pzObject;
                                    this.props.HomeComponent.pzUpdateHistoryStack(pzObject);
                                    this.props.HomeComponent.setState({ pzCanvasLoader: false, pzCanvasObject });
                                }
                            })
                        }
                    })
                    this.props.HomeComponent.setState({ pzCanvasObject });
                }
            })
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

    render(){
        return (
            <React.Fragment>
                {<PZClipart {...this.props} {...this.state} clickHandler={this.pzClipartHandler}/>}
            </React.Fragment>        
        );
    }
}
