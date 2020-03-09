import React from 'react';
import { List, Avatar } from 'antd';
import { Link } from "react-router-dom";

function UserList(props) {
    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={props.list}
                renderItem={username => (
                <List.Item>
                    <List.Item.Meta
                    avatar={<Link to={"/user/"+username}><Avatar icon="user" /></Link>}
                    title={<Link to={"/user/"+username}>{username}</Link>}
                    />
                </List.Item>
                )}
            />
        </div>
    );
}

export default UserList;