function GetKeyConfig(KeyName) {

    var objFilterType = {
        strIdSession: Session.IDSESSION,
        strfilterKeyName: KeyName
    };

    var value = '';
    $.app.ajax({
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: 'json',
        url: '/Transactions/HomeMoney/GetKeyConfig',
        data: JSON.stringify(objFilterType),
        success: function (response) {
            if (response.data != null)
                value = response.data;
        }
    }
    );
    return value;
}

function iframeLoaded() {
    var iFrameID = document.getElementById('myIframe');
    if (iFrameID) {
        // here you can make the height, I delete it first, then I make it again
        iFrameID.height = "";
        iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
    }
}

// runs a function after an iframe node's content has loaded // note, this almost certainly won't work for frames loaded from a different domain onReady: 
function LoadIframe(iframeNode) {
    var windowDocument = iframeNode[0].contentWindow.document;
    var iframeDocument = windowDocument ? windowDocument : iframeNode[0].contentWindow.document
    if (iframeDocument.readyState === 'complete') {
        iframeLoaded();
    }
    else { LoadIframe(iframeNode);}
}

function showLoading(Mensaje) {
    $.blockUI({
        message: Mensaje,
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000000',
            '-webkit-border-radius': '50px',
            '-moz-border-radius': '50px',
            opacity: .7,
            color: '#fff'
        }
    });
}


function hideLoading() {
    $.unblockUI();
}