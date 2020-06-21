const PZMailShare = (props) => {
    var message = '';
    var mailstatus = '';
    if (props.mailStatus == 'ok'){
        message = 'Mail Sent Successfully!!';
        mailstatus = 'success';
    }
    else if (props.mailStatus == 'err'){
        message = 'Something Went Wrong!!';
        mailstatus = 'mail-error';
    }
    return(
        <div className="mailpopup modal fade" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" onClick={(e) => { e.preventDefault(), props.closeMailPopup(e) }}>&times;</button>
                        <h4 className="modal-title">Share Your Design</h4>
                    </div>
                    <div className="modal-body">
                        <form id="mail-form" onSubmit={(e) => { e.preventDefault(), props.handleSubmit(e) }} method="POST">
                            <div className="form-group">
                                <label htmlFor="sender">Sender Email address:</label>
                                <input type="text" name="sendermail" className="form-control"  value={props.fields.sendermail} onChange={(e) => { e.preventDefault(), props.handleUserInput(e) }} />
                                <div className="errorMsg snd">{props.errors.sendermail}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="receiver">Receiver Email address:</label>
                                <input type="text" name="receivermail" className="form-control"  value={props.fields.receivermail} onChange={(e) => { e.preventDefault(), props.handleUserInput(e) }} />
                                <div className="errorMsg rcv">{props.errors.receivermail}</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message:</label>
                                <textarea name="message" className="form-control" rows="5" value={props.fields.message} onChange={(e) => { e.preventDefault(), props.handleUserInput(e) }} />
                            </div>
                            <div className={`${mailstatus}`}>{message}</div>
                            <button type="submit" className="submit">Submit</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}