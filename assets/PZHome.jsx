const PZHome = (props) => {
    console.log('dd',props.StaticContent)
    const pzGeneralSettings = props.pzDomainSettings;
    return (
        <div className="pz pz-main-widget">
            {props.pzPageLoader && <div className="pz-loader-cover">
                <div className="pz-loader"></div>
            </div>}
        
            <div className="pz-container">
                <div className="pz-custom-wrapper">
                    <div className={(props.fullScreen == true) ? "pz-image-section pz-img-full" : "pz-image-section"}>

                        <div className="pz-image-container">
                        {props.nextPageData && <iframe class="" width="643" height="480" src="https://www.youtube.com/embed/tGeTKmQIKrk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>}
<React.Fragment>
                            <div className={props.pzCanvasLoader ? 'pz-loader-cover show' : 'pz-loader-cover hide'}>
                                <div className="pz-loader"></div>
                            </div>
                            <canvas id="pz_preview_image" className={props.StaticContent ?"img-responsive" : "img-responsive hide"} name="pz_preview_image"></canvas>
                        </React.Fragment>        
                        </div>
                        
                        {(props.pzTotalViews > 1) &&
                            <div className={"pz-thumbail-container"}>
                                <div className="pz-thumnail-wrapper">
                                    <PromizeViews {...props} />
                                </div>
                            </div>
                        }
                        {pzGeneralSettings[2] ? <div className="pz-image-fullscreeen-control" onClick={(e) => { e.preventDefault(), props.HomeComponent.pzToggleFullScreen() }}>
                            <button className="pz-zoom-in" title="Fullscreen"><i className="fa fa-expand"></i></button>
                        </div> : ''}
                        {pzGeneralSettings[1] ? <div className="pz-image-zoom-controls">
                            <button className="pz-zoom-in" title="Zoom In" onClick={(e) => { e.preventDefault(), pzFCanvasZoom('zoomin', props.pzCanvas, e) }}><i className="fa fa-plus"></i></button>
                            <button className="pz-zoom-in" title="Zoom Out" onClick={(e) => { e.preventDefault(), pzFCanvasZoom('zoomout', props.pzCanvas, e) }}><i className="fa fa-minus"></i></button>
                        </div> : ''}
                        {pzGeneralSettings[3] ? <div className="pz-undo-redo-controls">
                            <button className="pz-zoom-in" title="Undo" onClick={(e) => { e.preventDefault(), props.HomeComponent.pzUndoRedoHandler('UNDO') }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="31.25" viewBox="0 0 50 31.25"><path d="M12.5,134.587H34.375v-3.125H12.5a9.375,9.375,0,0,1,0-18.75H42.187v6.25L50,111.15l-7.812-7.813v6.25H12.5a12.5,12.5,0,1,0,0,25Z"
                                                transform="translate(0 -103.338)" /></svg>
                            </button>
                            <button className="pz-zoom-in" title="Redo" onClick={(e) => { e.preventDefault(), props.HomeComponent.pzUndoRedoHandler('REDO') }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="31.25" viewBox="0 0 50 31.25"><path d="M37.5,103.337H15.625v3.125H37.5a9.375,9.375,0,0,1,0,18.75H7.812v-6.25L0,126.774l7.812,7.812v-6.25H37.5a12.5,12.5,0,1,0,0-25Z" transform="translate(0 -103.338)" /></svg>
                            </button>
                        </div> : ''}
                    </div>
                    <div className={(props.fullScreen == true) ? "pz-customizer-section pz-custom-hide" : "pz-customizer-section"}>
                        <div className="pz-customizer-wrapper">
                            <div className="pz-custom-item-wrapper">
                                <div className="pz-custom-item-menu">
                                    {Object.keys(props.pzCustomizer).length > 0 && <PromizeSection {...props} />}
                                </div>
                                <div className="pz-custom-content-wrapper">
                                    {Object.keys(props.pzCustomizer).length > 0 && <PromizeTab {...props} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pz-cart-container">
            {Object.keys(props.pzCustomizer).length > 0 && <PromizeCart {...props} />}
            </div>

            {props.pzPopup && <div className ="pz-reset-popup active" role="dialog">
                <div className ="pz-reset-dialog">
                    <div className ="pz-reset-content">
                        <p>Do you want clear all the changes you made?</p>
                        <div className ="pz-reset-action">
                            <button onClick={(e) =>{e.preventDefault(), props.HomeComponent.pzPopupHandler('cancel')}} className ="pz-reset-btn-n">Cancel</button>
                            <button onClick={(e) =>{e.preventDefault(), props.HomeComponent.pzPopupHandler('continue')}} className ="pz-reset-btn-y">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}