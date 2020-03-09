import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { notification, Upload, Button, Icon  } from 'antd';

function AddItem(props) {
    let history = useHistory();
    const [files, setFiles] = useState([]);
    const media = {
        name: 'content',
        action: '/addmedia',
        showUploadList: {showDownloadIcon: false, showRemoveIcon: false},
        onChange(info) {
            if (info.file.status === 'done') {
                notification['success']({
                    message: info.file.name + 'file uploaded successfully',
                    description:
                      'Id: ' + info.file.response.id,
                    duration: 0,
                });
                setFiles([...files, info.file.response.id]);
            } else if (info.file.status === 'error') {
                notification['error']({
                    message: info.file.name + 'file upload failed',
                    duration: 0,
                });
            }
        }
    };

    async function handleAddItem(event){
        event.preventDefault();
        const res = await axios.post('/additem', {
            content: event.target.content.value,
            parent: props.parent,
            media: files,
            childType: props.childType || null
        });
        notification['success']({
            message: 'Tweet successfully added',
            description:
              'Id: ' + res.data.id,
            duration: 0,
        });
        history.push('/');
    }

    return ( 
            <div>
                <form className="form-signin" onSubmit={handleAddItem}>
                        <div className="form-group row">
                            <label htmlFor="content" className="col-sm-3 col-form-label">Tweet</label>
                            <div className="col-sm-7">
                                Content: <textarea rows="4" cols="50" name="content" id="content" required></textarea>
                            </div>
                        </div>
                        <Upload {...media}>
                            <Button>
                                <Icon type="upload" /> Click to Upload
                            </Button>
                        </Upload>
                        <button className="btn btn-outline-dark text-uppercase mt-4" type="submit">Add Item</button>
                </form>
            </div>
    );
}

export default AddItem;