import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { DocumentEditorComponent, SfdtExport, Selection, Editor, WordExport } from '@syncfusion/ej2-react-documenteditor';

DocumentEditorComponent.Inject(SfdtExport, Selection, Editor, WordExport)

class Import extends React.Component {
    onImportClick() {
        //Open file picker.
        document.getElementById('file_upload').click();
    }
    save() {
        //Download the document in sfdt format.
        // this.documenteditor.save('sample', 'Sfdt');
        this.documenteditor.save('sample', 'Docx');

        this.documenteditor.saveAsBlob('Docx').then((exportedDocument) => {
            console.log(exportedDocument, '<----------------BLOB')
        })
    }

    onFileChange(e) {
        if (e.target.files[0]) {
            //Get selected file.
            let file = e.target.files[0];
            //Open sfdt document.
            // if (file.name.substr(file.name.lastIndexOf('.')) === '.docx') {
                let fileReader = new FileReader();
                fileReader.onload = (e) => {
                    let contents = e.target.result;
                    let proxy = this;
                    //Open the document in Document Editor.
                    proxy.documenteditor.open(contents);
                };
                //Read the file as text.
                fileReader.readAsText(file);
                this.documenteditor.documentName = file.name.substr(0, file.name.lastIndexOf('.'));
            // }
        }
    }
    render() {
        return (<div>
                <input type='file' id='file_upload' accept='.dotx,.docx,.docm,.dot,.doc,.rtf,.txt,.xml,.sfdt' onChange={this.onFileChange.bind(this)}/>
                <button onClick={this.onImportClick.bind(this)}>Import</button>
                <button onClick={this.save.bind(this)}>Save</button>

                <DocumentEditorComponent id="container" ref={scope => {
            this.documenteditor = scope;
        }} height={'330px'}
        
        isReadOnly={false} 
        enableSelection={true} 
        enableEditor={true} 
        enableSfdtExport={true}
        enableWordExport={true}


        />
            </div>);
    }
}

export default Import;