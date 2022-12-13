import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { DocumentEditorComponent, SfdtExport, Selection, Editor } from '@syncfusion/ej2-react-documenteditor';
//Inject require modules.
DocumentEditorComponent.Inject(SfdtExport, Selection, Editor);
class Export extends React.Component {
    save() {
        //Download the document in sfdt format.
        // this.documenteditor.save('sample', 'Sfdt');
        this.documenteditor.save('sample', 'docx');
    }
    render() {
        return (<div>
                <button onClick={this.save.bind(this)}>Save</button>
                <DocumentEditorComponent 
                id="container" 
                height={'330px'} 
                ref={(scope) => { this.documenteditor = scope; }} 
                isReadOnly={false} 
                enableSelection={true} 
                enableEditor={true} 
                enableSfdtExport={true}
                />
            </div>);
    }
}

export default Export;