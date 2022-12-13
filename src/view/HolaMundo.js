import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { DocumentEditorComponent } from '@syncfusion/ej2-react-documenteditor';
class HelloWorld extends React.Component {
    componentDidMount() {
        let sfdt = `{
            "sections": [
                {
                    "blocks": [
                        {
                            "inlines": [
                                {
                                    "characterFormat": {
                                        "bold": true,
                                        "italic": true
                                    },
                                    "text": "Hello World"
                                }
                            ]
                        }
                    ],
                    "headersFooters": {
                    }
                }
            ]
        }`;
        setTimeout(() => {
            //Open the document in Document Editor.
            this.documenteditor.open(sfdt);
        });
    }
    render() {
        return (<DocumentEditorComponent id="container" height={'330px'} ref={(scope) => { this.documenteditor = scope; }}/>);
    }
}
export default HelloWorld