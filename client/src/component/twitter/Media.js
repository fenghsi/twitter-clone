import React, { useState } from 'react';
import { useParams } from "react-router-dom";

function Media(props) {
    const { id } = useParams();
    const [type, setType] = useState('IMG');

    return (
        <div>
            <h1>Media</h1>
            { type === 'IMG' &&
                <img src={'/' + id} onError={() => setType('VIDEO')} alt="DNE"></img>
            }
            { type === 'VIDEO' &&
                <video width="320" height="240" onError={() => setType('NONE')} autoPlay controls>
                    <source src={'/' + id}/>
                </video>
            }
            { type === 'NONE' &&
                <p>File doesn't exists</p>
            }
        </div>
    );
}

export default Media;