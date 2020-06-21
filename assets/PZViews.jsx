const PZViews = (props) => {
    return (
        <React.Fragment>
            {props.pzViews.length > 0 &&
                <ul className="pz-thumbnail-items">
                    {props.pzViews.map((view, index) => {
                        return <li key={index} className={(props.pzCurrentView == view.id) ? 'pz-thumbnail-item side_' + view.id + ' active' : 'pz-thumbnail-item side_' + (view.id)} onClick={(e) => { e.preventDefault(), props.pzChangeView(view.id) }}>
                            <canvas id={'thumbView_' + (view.id)} className="img-responsive thumb-canvas"></canvas>
                            <div className="pz-thumbnail-detail">
                                <span className="pz-thumbnail-name">{view.view_name}</span>
                            </div>
                        </li>
                    })}
                </ul>}
        </React.Fragment>
    );
}