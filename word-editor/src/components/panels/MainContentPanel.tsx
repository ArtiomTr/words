import React from 'react'
import { NotOpened } from '../common/NotOpened';

export default class MainContentPanel extends React.Component<{ opened: boolean }> {

    public render(): React.ReactNode {
        const { children, opened } = this.props;
        return (
            <div className="app-content">
                {opened ? children : <NotOpened />}
            </div>
        );
    }

}