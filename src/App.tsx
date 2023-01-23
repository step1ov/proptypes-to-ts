import React, {useState} from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './App.css';
import Convert from "./convert";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

    const [isInterface, setIsInterface] = useState(true);
    const [code, setCode] = useState(
        `DemoControl.propTypes = {
    style: PropTypes.any,
    placeholder: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
    children: PropTypes.array,
    onVoiceSearch: PropTypes.func,
    onSelect: PropTypes.func,
    selectedIndex: PropTypes.number,
    selectSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectMode: PropTypes.number,
    iconRight: PropTypes.bool,
    editable: PropTypes.bool
};`);
    const result = Convert(code, isInterface);

    const handlePaste = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigator.clipboard.readText()
            .then(code => {
                setCode(code);
                const result = Convert(code, isInterface);
                if (result) {
                    navigator.clipboard.writeText(result)
                        .then(() => {
                            toast("Copied to clipboard!");
                        })
                        .catch(err => {
                            console.error('Failed to write to clipboard: ', err);
                        });
                }
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    }

    const handleCopy = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log("here");
        navigator.clipboard.writeText(result)
            .then(() => {
                console.log("here1");
                toast("Copied to clipboard!");
            })
            .catch(err => {
                console.error('Failed to write to clipboard: ', err);
            });
    }

    const handleClear = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setCode('');
    }

    return (
        <div className="app">
            <ToastContainer hideProgressBar={true} autoClose={1500} />
            <div className="head">
                <img className="logo" src="/logo192.png" alt="logo" />
                <h1 className="title">PropTypes to TypeScript Interface / Type Converter</h1>
            </div>
            <div className="buttons">
                <button className="control button" onClick={handlePaste}>Paste source</button>
                <button className="control button" onClick={handleCopy}>Copy result</button>
                <button className="control button" onClick={handleClear}>Clear</button>
                <span className="control">
                    <input type="checkbox"
                           checked={isInterface}
                           onChange={() => setIsInterface(prev => !prev)}/>
                    Is Interface
                </span>

            </div>
            <div className="container">
                <div className="col">
                    <Editor
                        value={code} className={"editor"}
                        onValueChange={code => setCode(code)}
                        highlight={code => highlight(code, languages.js, "js")}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                        }}
                    />
                </div>
                <div className="col">
                    <Editor
                        value={result} className={"editor"}
                        onValueChange={() => {}}
                        highlight={code => highlight(code, languages.js, "js")}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
