import React from 'react';
import { Link } from 'react-router-dom';

function PostItemId(props) {

    return (
        <React.Fragment>
            <Link to={"/item/" + props.post}>{props.post}</Link>
            { props.canDelete &&
                <button className="btn btn-outline-dark text-uppercase mt-4" onClick={() => props.handleDeleteTwitter(props.post)}>Delete</button>
            }
        </React.Fragment>
    );
}

export default PostItemId;