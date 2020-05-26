import React    from 'react';
import FileCard from './FileCard';
import "./Bookshelf.css";

function Bookshelf(props) {
    return(
        <div className="Bookshelf">
            {
                props.fileInfo.map((info, idx) => (
                    <FileCard 
                        // FIXME variable name mismatch
                        key={idx}
                        preview_ipfs_hash={info.preview_ipfs_hash} 
                        main_ipfs_hash={info.main_ipfs_hash} 
                        filename={info.filename} 
                    />

                ))
            }
        </div>
    )
}

export default Bookshelf;