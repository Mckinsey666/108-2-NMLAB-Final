import React, { Component } from "react";
import { PDFDocument } from 'pdf-lib'
import { getPreviewContent } from "../utils/preview";
import "./UploadPage.css";


let Jimp = require('jimp');

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({host :"ntuee.org", port: 5002, protocol: "http"});

const styles = {
    topicText: {
        color: "white"
    }
}

const previewCharNum = 500;

class UploadPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainIPFSHash: "",
            previewIPFSHash: "",
            buffer: "",
            previewBuffer: "",
            fileName: "",
            fileType: "",
        }
    }

    onSubmit = async(e) => {
        e.preventDefault();
        if(this.state.buffer.length === 0) {
            alert("No files uploaded!");
            return;
        }
        //Send to ipfs server node
        console.log(ipfs.getEndpointConfig());
        console.log(ipfs);
        const mainIPFSHash = await this.uploadFile(this.state.buffer, "main");
        const previewIPFSHash = await this.uploadFile(this.state.previewBuffer, "preview");
        console.log(mainIPFSHash, previewIPFSHash);
        
        const { accounts, contract } = this.props;
        console.log(accounts);
        let status = await contract.methods.Upload([
            this.state.fileName,
            this.state.fileType,
            mainIPFSHash,
            previewIPFSHash,
            0, // TODO
            accounts[0],
        ]).send({from: accounts[0]});
        console.log("upload status", status);
        
        this.setState({
            mainIPFSHash: mainIPFSHash,
            previewIPFSHash: previewIPFSHash,
        })
        console.log("FINISH!");
    }

    uploadFile = async(buffer, statePrefix) => {
        const result = await ipfs.add(buffer).next();
        return result.value.path;
    }

    onFileUpload = e => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.target.files[0];
        // file.name = file original upload name
        // file.size 
        const fileType = this.getFileTypes(file.type);
        if(fileType === null) {
            alert("Invalid file type!");
            return;
        }
        this.setState({
            fileName: file.name,
            mainIPFSHash: "",
            previewIPFSHash: "",
            buffer: "",
            previewBuffer: "",
            fileType: fileType
        })
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.toBuffer(reader);
    }

    toBuffer = async reader => {
        const buffer = await Buffer.from(reader.result);
        const previewBuffer = await this.createPreviewFileBuffer(buffer);
        this.setState({
            buffer: buffer,
            previewBuffer: previewBuffer,
        });
    }

    createPreviewFileBuffer = async mainBuffer => {
        let previewBuffer = null;
        if(this.state.fileType == 'text') {
            let allContent = mainBuffer.toString('utf8');
            let previewContent = allContent.substring(0, previewCharNum);
            previewContent += '\nSubscribe to unlock all content';
            previewBuffer = Buffer.from(previewContent, 'utf8');
        }
        else if(this.state.fileType == 'image') {
            let img = await Jimp.read(mainBuffer.slice());
            img.blur(10);
            previewBuffer = await img.getBufferAsync(Jimp.MIME_JPEG);
        }
        else if(this.state.fileType == 'pdf') {
            let pdfDoc = await PDFDocument.load(mainBuffer.slice());
            let previewDoc = await PDFDocument.create();
            let [firstPage] = await previewDoc.copyPages(pdfDoc, [0]); // extract first page
            previewDoc.addPage(firstPage);
            previewBuffer = await previewDoc.save();

        }
        return previewBuffer;
    }

    getFileTypes = typeStr => {
        let filetype = typeStr.split('/'); // return type / subtype
        if(filetype[0] == 'text') return 'text';
        else if(filetype[0] == 'image') return 'image';
        else if(filetype[1] == 'pdf') return 'pdf';
        return null;
    }

    render() {
        return (
            <div className="UploadPage">
                <form onSubmit={this.onSubmit}>
                    <label className="file-upload">
                        <input 
                            type = "file"
                            onChange = {this.onFileUpload}
                        />
                        File Upload
                    </label>
                    <button
                        type="submit"
                    > 
                        Send file to ipfs
                    </button>
                </form>
                <div className="preview">{getPreviewContent(this.state.previewBuffer, this.state.fileType)}</div>
                <div className="footer">
                    <div className="footer-field">
                        <div className="footer-key">File uploaded</div>
                        <div className="footer-value">{this.state.fileName}</div>
                    </div>
                    <div className="footer-field">
                        <div className="footer-key">Main File CID</div> 
                        <div className="footer-value">{this.state.mainIPFSHash}</div>
                    </div>
                    <div className="footer-field">
                        <div className="footer-key">Preview File CID</div> 
                        <div className="footer-value">{this.state.previewIPFSHash}</div>
                    </div>
                    <div className="footer-field">
                        <div className="footer-key">File type</div> 
                        <div className="footer-value">{this.state.fileType}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UploadPage;