function asyncQuery(aActionName, aParameter, aCallback, aPassErrors)
{
    if ( aParameter == null)
        aParameter = new Object();

    aParameter.Action = aActionName;
    
    var errorFiltered = function(aXHR) {
        if ( (aXHR.error == null) || (aXHR.error.length == 0) )
            aCallback(aXHR);
    };

    $.ajax({
        type     : "POST",
        url      : "lib/messagehub.php",
        dataType : "json",
        async    : true,
        data     : aParameter,
        complete : onAsyncDone,
        success  : (aPassErrors === true) ? aCallback : errorFiltered,
        error    : onAsyncError
    });
}

// -----------------------------------------------------------------------------

function blockingQuery(aActionName, aParameter, aCallback)
{
    if ( aParameter == null)
        aParameter = new Object();

    aParameter.Action = aActionName;

    $.ajax({
        type     : "POST",
        url      : "lib/messagehub.php",
        dataType : "json",
        async    : false,
        data     : aParameter,
        complete : onAsyncDone,
        success  : aCallback,
        error    : onAsyncError
    });
}

// -----------------------------------------------------------------------------

function getXHRErrors( aXHR )
{
    if ( (aXHR.error != null) && (aXHR.error.length > 0) )
    {
        var Message = "";
        $.each(aXHR.error, function(index, value) { Message += value; });
        return Message;
    }

    return null;
}

// -----------------------------------------------------------------------------

function onAsyncDone( aXHR )
{
    $("#ajaxblocker").clearQueue().hide();

    var Errors = getXHRErrors(aXHR.responseJSON);

    if ( Errors != null )
    {
        notify( L("RequestError") + "<br/><br/>" + Errors );
    }
}

// -----------------------------------------------------------------------------

function onAsyncError( aXHR, aStatus, aError )
{
    $("#ajaxblocker").clearQueue().hide();

    var Message = L("RequestError") + "<br/><br/>Status " + aStatus + "<br/>" + aError;

    notify( Message );
}