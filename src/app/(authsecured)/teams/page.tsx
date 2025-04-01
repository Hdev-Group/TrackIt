import React from 'react';
import Teams from './teams';

export async function generateMetadata({ params }: any) {

    return {
        title: `Teams | TrackIt`,
        description: `Manage your teams and members in TrackIt.`,
    };
}

export default function ProductWrapper() {
    return <Teams />;
}
