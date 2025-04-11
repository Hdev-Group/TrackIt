import React from 'react';
import Settings from './settings';

export async function generateMetadata({ params }: any) {

    return {
        title: `Settings | TrackIt`,
        description: `Manage your teams and members in TrackIt.`,
    };
}

export default function ProductWrapper() {
    return <Settings />;
}
