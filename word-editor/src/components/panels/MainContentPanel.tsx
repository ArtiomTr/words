import React from 'react'

export default class MainContentPanel extends React.Component {

    public render(): React.ReactNode {
        const { children } = this.props;
        return (
            <div className="app-content">
                {children}
            </div>
        );
    }

}