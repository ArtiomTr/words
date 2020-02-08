import React from 'react'
import { FullscreenMessage } from '../common/FullscreenMessage';

export default class MainContentPanel extends React.Component<{ opened: boolean }> {

    public render(): React.ReactNode {
        const { children, opened } = this.props;
        return (
            <div className="app-content">
                {opened ? children : <FullscreenMessage message="Not opened file ¯\_(ツ)_/¯" />}
            </div>
        );
    }

}