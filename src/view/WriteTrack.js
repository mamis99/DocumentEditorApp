import * as ReactDOM from 'react-dom';
import * as React from 'react';
import AWSUtil from './../util/aws.util'
import { DocumentEditorComponent, SfdtExport, Selection, Editor, WordExport } from '@syncfusion/ej2-react-documenteditor';

DocumentEditorComponent.Inject(SfdtExport, Selection, Editor, WordExport)

class WriteTrack extends React.Component{
    send() {
        let revision = this.documenteditor.revisions;
        console.log(revision);
        let datosExtraidos = [];
        revision.changes.map((usuarios, index) => {
          datosExtraidos[index] = {
            autor: usuarios.author
          };
          usuarios.range.map((texto, indexTwo) => {
            // datosExtraidos[index].data[0]= texto.text || 'No trajo nada'
            console.log(typeof texto);
          });
        });
        console.log(datosExtraidos, '<-----------------Datos extraidos');
    }
    
    save() {
        let revision = this.documenteditor.revisions;
        revision.acceptAll();
    }
    
    delete() {
        let revision = this.documenteditor.revisions;
        revision.rejectAll();
    }
      
    async aws() {
        let awsUtil = new AWSUtil();
        let document = await awsUtil.downloadPDFBase64BucketObjectMiFirma('microservices/MiFirma/assets/docs/sample.sfdt');
        //console.log(typeof document)
        this.loadFile(document);  
    }
      
    export() {
        //Download the document in sfdt format.
        // this.documenteditor.save('sample', 'Sfdt');
        this.documenteditor.save('sample', 'Docx');
        this.documenteditor.saveAsBlob('Docx').then(exportedDocument => {
          console.log(exportedDocument, '<----------------BLOB');
        });
    }
      
    onFileChange(e) {
        if (e.target.files[0]) {
          console.log(e.target.files[0], '<-------- DOC');
          //Get selected file.
          let file = e.target.files[0];
          //Open sfdt document.
          this.typeOfDocument(file);
        }  
    }
      
    typeOfDocument(file) {
        if (file.name.substr(file.name.lastIndexOf('.')) === '.sfdt') {
          let fileReader = new FileReader();
          fileReader.onload = e => {
            let contents = e.target.result;
            let proxy = this;
            //Open the document in Document Editor.
            proxy.documenteditor.open(contents);
          };
          //Read the file as text.
          fileReader.readAsText(file);
          this.documenteditor.documentName = file.name.substr(0, file.name.lastIndexOf('.'));
        } else {
          this.loadFile(file);
        }  
    }

    loadFile(file) {
        let ajax = new XMLHttpRequest();
        ajax.open('POST', 'https://localhost:7003/api/TodoItems', true);
        ajax.onreadystatechange = () => {
          if (ajax.readyState === 4) {
            if (ajax.status === 200 || ajax.status === 304) {
              // open SFDT text in document editor
              this.documenteditor.open(ajax.responseText);
            } else {
              alert("No hay respuesta del backend");
            }
          }
        };
        let formData = new FormData();
        formData.append('files', file);
        ajax.send(formData);  
    }
    
    //     componentDidMount(){
    // this.documenteditor.spellChecker.languageID= 1033 //en us
    //     }
    
    render() {
        return(
            <div>
                <button onClick={this.send.bind(this)}>Enviar cambios</button>
                <button onClick={this.save.bind(this)}>Guardar</button>
                <button onClick={this.delete.bind(this)}>Eliminar</button>
                <button onClick={this.aws.bind(this)}>Amazon</button>
                <input type='file' id='file_upload' accept='.dotx,.docx,.docm,.dot,.doc,.rtf,.txt,.xml,.sfdt' onChange={this.onFileChange.bind(this)}/>
                <button onClick={this.export.bind(this)}>Export</button>

                <DocumentEditorComponent 
                id= "container"
                height= '620px'
                ref= {scope => { this.documenteditor = scope; }}
                enableTrackChanges={true} //habilitar la vista de cambios.
                currentUser= 'Isaac Martínez' //recibe el nombre del usuario.

                isReadOnly={false}
                enablePrint={true}
                enableSelection={true}
                enableEditor={true}
                enableEditorHistory={true}
                enableContextMenu={true}
                enableSearch={true}
                enableOptionsPane={true}
                enableBookmarkDialog={true}
                enableBordersAndShadingDialog={true}
                enableFontDialog={true}
                enableTableDialog={true}
                enableParagraphDialog={true}
                enableHyperlinkDialog={true}
                enableImageResizer={true}
                enableListDialog={true}
                enablePageSetupDialog={true}
                enableSfdtExport={true}
                enableStyleDialog={true}
                enableTableOfContentsDialog={true}
                enableTableOptionsDialog={true}
                enableTablePropertiesDialog={true}
                enableTextExport={true}
                enableWordExport={true}
                showRevisions={true}
                documentChange= { e => { console.log('Prueba de trigger', e); }}
                trackChange= { e => { console.log('Prueba de trigger en track change?', e); }}
                />
            </div>
        );
    }
}

export default WriteTrack;
