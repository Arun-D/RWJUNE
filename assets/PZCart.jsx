const PZCart = (props) => {
    const downloadimage = props.pzCustomizer.product.promize_customizer_name;
    // const options = props.pzActiveOptions;
    const pzGeneralSettings = props.pzDomainSettings;
    // const tabData = props.pzCustomizer.tabs;
    // const attributeOptions = props.pzCustomizer.attributeOptions;
    const canvasObject = props.pzCanvasObject;
    const currentView = props.pzCurrentView;
    const installData = props.InstallationData;   
    const canvasData = canvasObject[currentView];
    const biCommerceAddToCart = () => { 
        console.log("bigcommerce add to cart triggered")
    }

    function numberWithCommas(n) {
        var parts=n.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    }

    return (
       
        <div className="pz-container">
             <div className="pz-selectedOptions">
             <h3 class="pz-selectedOptions-title">{props.StaticContent ? "Your custom build": "Installation option"} </h3>
             {!props.nextPageData && canvasData && 
                    <ul class="pz-selectedOptions-wrapper">
                        {Object.keys(canvasData).map((obj, idx)=>{
                            if(obj != "baseImage"){
                                return (
                                    <div className="pz-selectedOptions-wrapper-container">
                                    <li class="pz-selectedOptions-list">
                                        <span class="pz-selectedOptions-list__white">
                                            {canvasData[obj].tab_name}
                                        </span>
                                        <span class="pz-selectedOptions-list__white">
                                            COST
                                        </span>
                                    </li>
                                    <li class="pz-selectedOptions-list">
                                         <span class="pz-selectedOptions-list__yellow">
                                             {canvasData[obj].option_name}
                                             </span>
                                         <span class="pz-selectedOptions-list__yellow">$ {canvasData[obj].option_price? canvasData[obj].option_price.toFixed(2):parseFloat(0.00).toFixed(2)}</span>
                                     </li>
                                     </div>
                                )
                            }
                            })
                        }
                    </ul>
                }
             {props.nextPageData && installData && 
                    <ul class="pz-selectedOptions-wrapper">
                        {Object.keys(installData).map((obj)=>{
                            return (
                                <div className="pz-selectedOptions-wrapper-container">
                                    <li class="pz-selectedOptions-list">
                                        <span class="pz-selectedOptions-list__white">
                                            {obj}
                                        </span>
                                    </li>
                                    <li class="pz-selectedOptions-list">
                                        <span class="pz-selectedOptions-list__yellow">
                                            {installData[obj][0]}
                                            </span>
                                            <span class="pz-selectedOptions-list__yellow">$ {installData[obj][1]?installData[obj][1]:parseFloat(0.00).toFixed(2) }</span>
                                    </li>
                                </div>
                                )
                            })
                        }
                    </ul>
                }   
                 {/* {props.pzActiveOptions && 
                 <ul>
                    {Object.keys(tabData).map((tab, index) => {
                        if(options.hasOwnProperty(tab)){
                            // const options = activeOptions[tab]
                            return (
                                <li>
                                    <div className="tab-name">
                                        {tabData[tab].tab_name}
                                        <span>
                                            COST
                                        </span>
                                    </div>
                                    <div className="option-name">
                                        {attributeOptions[options[tab][0]][options[tab][1]].promize_attribute_value.option_name}
                                        <span>{attributeOptions[options[tab][0]][options[tab][1]].promize_attribute_value.option_price}</span>
                                    </div>
                                </li>
                            )
                        }
                    })
                    }
                 </ul>
                 } */}
            </div>
            <hr class="pz-selectedOptions-subtotal-hr" />
            <div class="pz-selectedOptions-subtotal">
                <div> Subtotal</div>
                {/* <div> ${props.pzProductPrice.toFixed(2).toLocaleString()}</div> */}
                <div> ${numberWithCommas(props.pzProductPrice.toFixed(2))}</div>
                
            </div>

            <div className="pz-cart-wrapper">
                <div className="pz-product-title-wrapper">
                    <h2 className="pz-product-title">
                        <span className="pz-title">{props.pzCustomizer.product.promize_customizer_name}</span>
                    </h2>
                </div>
                        {pzGeneralSettings[9] ? <div className="pz-quantity-container">
                                <div className="pz-quantity">
                                    <button className="pz-qty-dec" disabled={props.pzQuantity <= 1 ? "disabled" : ''} onClick={(e) => {props.pzQuantityHandler(e, props.pzQuantity-1)}}>
                                        <i className="fa fa-minus"></i>
                                    </button>
                                    <input type="number" onChange={e =>{props.pzQuantityHandler(e)}} value={props.pzQuantity} className="pz-qty-field" onBlur={e =>{props.pzQuantityHandler(e, props.pzQuantity ? props.pzQuantity : 1)}} min={1} id="pz-qty-field"/>
                                    <button className="pz-qty-inc" onClick={(e) => {props.pzQuantityHandler(e, (props.pzQuantity+1))}}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div> : ''
                        }
                        {pzGeneralSettings[10] && props.pzProductPrice ? <div className="pz-price-container">
                            <h4 className="pz-price">$ {parseFloat(props.pzProductPrice).toLocaleString('en-US', {minimumFractionDigits: 2})}</h4>
                            </div> : ''
                        }
                        {pzGeneralSettings[7] ? <div className="pz-add-to-cart-container"><div className="pz-cart-child-button">
                                <button onClick={e=>{props.pzPlatform == 'bigcommerce' ? biCommerceAddToCart() : props.HomeComponent.pzAddToCart()}} className={!props.StaticContent?"pz-btn-cart":"pz-btn-cart hide"} >Add to cart</button>
                                
                        </div><Apppop StaticContent={props.StaticContent} /><div className="pz-cart-next-button"><button onClick={e=>{e.preventDefault(),props.HomeComponent.pzSetNextPage()}}  className={props.StaticContent?"pz-btn-cart":"pz-btn-cart hide"} >Next Step</button></div></div> : ''
                        }
                        {pzGeneralSettings[6] ? <div className="pz-save-for-later">
                                <a id="download" download={`${downloadimage}.jpeg`} href={props.canvasurl} >
                                    <button className="pz-btn-save" onClick={(e) => { e.preventDefault(), props.pzDownloadHandler() }}>
                                        <i className="fa fa-download"></i>
                                        <span>Download</span>
                                    </button>
                                </a>
                            </div> : ''
                        }
                        {pzGeneralSettings[4] ? <div className="pz-share">
                                <button className="pz-btn-share" onClick={(e) => { e.preventDefault(), props.pzShare() }}>
                                    <i className="fa fa-share"></i>
                                    <span>
                                        Share
                                </span>
                                </button>
                            </div> : ''
                        }
                        {pzGeneralSettings[8] ? <div className="pz-startover">
                                <button className="pz-btn-share" onClick={(e) => { e.preventDefault(), props.pzStartOverHandler() }}>
                                    <i className="fa fa-share"></i>
                                    <span>
                                        Startover
                                </span>
                                </button>
                            </div> : ''
                        }
                        
            </div>
        </div>
    )
};  