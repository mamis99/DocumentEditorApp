$("#fileExplorer").ejFileExplorer({
    "isResponsive": true,
    "layout": "tile",
    "width": "100%",
    "fileTypes": "*.png, *.gif, *.jpg, *.jpeg, *.docx",
    "path": "~/FileExplorerContent/",
    "ajaxAction": "/Home/FileActionDefault",
    "minWidth": "150px",
    "beforeOpen": "onBeforeOpen"
});
 
var dialog = new ejs.popups.Dialog({
    "height": "100%",
    "isModal": true,
    "showCloseIcon": true,
    "visible": false,
    "zIndex": 0.0,
    "beforeOpen": onDialogBeforeOpen,
    "close": onDialogClose,
    "open": resizeEditor
});
dialog.appendTo("#dialog");
 
var container = new ejs.documenteditor.DocumentEditorContainer({
    "enableLocalPaste": false,
    "enableToolbar": true,
    "restrictEditing": false,
    "showPropertiesPane": false
});
container.appendTo("#container");
 
var filePicker = document.getElementById("filePicker_target");
 
function onBeforeOpen(args) {
 
    if (args.itemType == "File" && (/\.(doc|docx|rtf|txt|html)$/i).test(args.model.selectedItems[0])) {
        dialog.show();
        var filePath = args.model.selectedFolder + args.model.selectedItems[0];
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', "/api/DocumentEditor/Import?filePath=" + filePath, true);
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200 || httpRequest.status === 304) {
                    container.documentEditor.open(httpRequest.responseText);
                } else {
                    console.error(httpRequest.response);
                }
            }
        }
            ;
        httpRequest.send();
    }
}
 
function resizeEditor() {
    var container = document.getElementById("container").ej2_instances[0];
    container.documentEditor.resize();
}
function onDialogBeforeOpen() {
    filePicker.style.display = 'none';
    setTimeout(function () {
        resizeEditor();
    });
}
function onDialogClose() {
    filePicker.style.display = 'block';
}
 