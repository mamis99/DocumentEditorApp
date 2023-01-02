import * as ReactDOM from 'react-dom';
import * as React from 'react';
import AWSUtil from './../util/aws.util'
import { DocumentEditorComponent, SfdtExport, Selection, Editor, WordExport, Print, RevisionCollection } from '@syncfusion/ej2-react-documenteditor';

DocumentEditorComponent.Inject(SfdtExport, Selection, Editor, WordExport, Print)

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
            //datosExtraidos[indexTwo].data[0]= texto.text || 'No trajo nada'
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

    restrict(){
      let sfdt = `{"sections":[{"blocks":[{"characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0},"paragraphFormat":{"lineSpacing":32.0,"lineSpacingType":"Exactly","styleName":"Normal"},"inlines":[{"text":"Name","characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0}},{"text":":","characterFormat":{"fontSize":14.0,"fontSizeBidi":14.0}}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":20.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"editRangeId":"1348272392","columnFirst":0,"columnLast":0,"user":"engineer@mycompany.com"},{"text":"Enter name"},{"editRangeId":"1348272392","editableRangeStart":{"editRangeId":"1348272392","columnFirst":0,"columnLast":0,"user":"engineer@mycompany.com"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0},"paragraphFormat":{"lineSpacing":32.0,"lineSpacingType":"Exactly","styleName":"Normal"},"inlines":[{"text":"Designation:","characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0}}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":20.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"editRangeId":"808933422","columnFirst":0,"columnLast":0,"user":"engineer@mycompany.com"},{"text":"Enter designation"},{"editRangeId":"808933422","editableRangeStart":{"editRangeId":"808933422","columnFirst":0,"columnLast":0,"user":"engineer@mycompany.com"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0},"paragraphFormat":{"lineSpacing":32.0,"lineSpacingType":"Exactly","styleName":"Normal"},"inlines":[{"text":"Email Address:","characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0}},{"name":"_GoBack","bookmarkType":0},{"name":"_GoBack","bookmarkType":1}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":20.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"editRangeId":"810441411","columnFirst":0,"columnLast":0,"user":"engineer@mycompany.com"},{"text":"Enter email address"},{"editRangeId":"810441411","editableRangeStart":{"editRangeId":"810441411","columnFirst":0,"columnLast":0,"user":"engineer@mycompany.com"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0},"paragraphFormat":{"lineSpacing":32.0,"lineSpacingType":"Exactly","styleName":"Normal"},"inlines":[{"text":"Feedbacks:","characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0}}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":20.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"editRangeId":"1016946268","columnFirst":0,"columnLast":0,"user":"manager@mycompany.com"},{"text":"Enter the feedbacks"},{"editRangeId":"1016946268","editableRangeStart":{"editRangeId":"1016946268","columnFirst":0,"columnLast":0,"user":"manager@mycompany.com"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0},"paragraphFormat":{"lineSpacing":32.0,"lineSpacingType":"Exactly","styleName":"Normal"},"inlines":[{"text":"Review comments:","characterFormat":{"bold":true,"fontSize":14.0,"boldBidi":true,"fontSizeBidi":14.0}}]},{"rows":[{"rowFormat":{"allowBreakAcrossPages":true,"isHeader":false,"height":20.0,"heightType":"AtLeast","borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}},"cells":[{"blocks":[{"paragraphFormat":{"styleName":"Normal"},"inlines":[{"editRangeId":"1373703080","columnFirst":0,"columnLast":0,"user":"manager@mycompany.com"},{"text":"Enter the comments"},{"editRangeId":"1373703080","editableRangeStart":{"editRangeId":"1373703080","columnFirst":0,"columnLast":0,"user":"manager@mycompany.com"}}]}],"cellFormat":{"columnSpan":1,"rowSpan":1,"preferredWidth":467.5,"preferredWidthType":"Point","verticalAlignment":"Center","isSamePaddingAsTable":true,"borders":{"left":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}}}}]}],"title":null,"description":null,"tableFormat":{"allowAutoFit":true,"leftIndent":0.0,"tableAlignment":"Left","preferredWidthType":"Auto","borders":{"left":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"right":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"top":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"bottom":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"vertical":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"horizontal":{"lineStyle":"Single","lineWidth":0.5,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalDown":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false},"diagonalUp":{"lineStyle":"None","lineWidth":0.0,"shadow":false,"space":0.0,"hasNoneStyle":false}},"bidi":false}},{"paragraphFormat":{"styleName":"Normal"},"inlines":[]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header"},"inlines":[{"text":"Employee’s Details "}]}]}},"sectionFormat":{"headerDistance":36.0,"footerDistance":36.0,"pageWidth":612.0,"pageHeight":792.0,"leftMargin":72.0,"rightMargin":72.0,"topMargin":72.0,"bottomMargin":72.0,"differentFirstPage":false,"differentOddAndEvenPages":false,"bidi":false}}],"characterFormat":{"fontSize":11.0,"fontFamily":"Calibri","fontSizeBidi":11.0,"fontFamilyBidi":"Calibri"},"paragraphFormat":{"afterSpacing":8.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple"},"background":{"color":"#FFFFFFFF"},"styles":[{"type":"Paragraph","name":"Normal","next":"Normal"},{"type":"Character","name":"Default Paragraph Font"},{"type":"Paragraph","name":"List Paragraph","basedOn":"Normal","paragraphFormat":{"leftIndent":36.0,"contextualSpacing":true}},{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Normal","link":"Header Char","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Header Char","basedOn":"Default Paragraph Font"},{"type":"Paragraph","name":"Footer","basedOn":"Normal","link":"Footer Char","paragraphFormat":{"afterSpacing":0.0,"lineSpacing":1.0,"lineSpacingType":"Multiple","tabs":[{"tabJustification":"Center","position":234.0,"tabLeader":"None","deletePosition":0.0},{"tabJustification":"Right","position":468.0,"tabLeader":"None","deletePosition":0.0}]}},{"type":"Character","name":"Footer Char","basedOn":"Default Paragraph Font"}],"defaultTabWidth":36.0,"formatting":false,"protectionType":"ReadOnly","enforcement":true,"hashValue":"TQGuJuLceQCe234Ygx4q6NFgHpRMfi1hjFTojyKzbQOkwk+ckEM9CjNIdkiUhSR/e/7sfMxO4sbPcg/DBzztMg==","saltValue":"FXbkr1RtDIIIZfwlM71dMg=="}`;
      setTimeout(() => {
        //Open the document in Document Editor.
        this.documenteditor.open(sfdt);
    });
    }
    
    render() {
        return(
            <div>
                <button onClick={this.send.bind(this)}>Enviar cambios</button>
                <button onClick={this.save.bind(this)}>Guardar</button>
                <button onClick={this.delete.bind(this)}>Eliminar</button>
                <button onClick={this.aws.bind(this)}>Amazon</button>
                <input type='file' id='file_upload' accept='.dotx,.docx,.docm,.dot,.doc,.rtf,.txt,.xml,.sfdt' onChange={this.onFileChange.bind(this)}/>
                <button onClick={this.export.bind(this)}>Export</button>
                <button onClick={this.restrict.bind(this)}>Restrict</button>

                <DocumentEditorComponent 
                id= "container"
                height= '620px'
                ref= {(scope) => { this.documenteditor = scope; }}
                enableTrackChanges={true} //habilitar la vista de cambios.
                showRevisions={true} //Muestra los cambios de revisión en el documento 
                currentUser= 'Isaac Martínez' //recibe el nombre del usuario.

                isReadOnly={false}
                //enableBookmarkDialog={true}
                //enableBordersAndShadingDialog={true}
                //enableContextMenu={true}
                enableEditor={true}
                //enableEditorHistory={true}
                //enableFontDialog={false}
                //enableHyperlinkDialog={true}
                //enableImageResizer={true}
                //enableListDialog={true}
                //enableOptionsPane={true}
                //enablePageSetupDialog={true}
                //enableParagraphDialog={true}
                enablePrint={true}
                //enableSearch={true}
                //enableSelection={true}
                enableSfdtExport={true}
                //enableStyleDialog={true}
                //enableTableDialog={true}
                //enableTableOfContentsDialog={true}
                //enableTableOptionsDialog={true}
                //enableTablePropertiesDialog={true}
                enableTextExport={true}
                enableWordExport={true}
                
                documentChange= { e => { console.log('Prueba de trigger', e); }}
                trackChange= { e => { console.log('Prueba de trigger en track change?', e); }}
                
                />
            </div>
        );
    }
}

export default WriteTrack;
