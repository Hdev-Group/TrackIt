import React from 'react';
import Page from './signUp';
import { preloadQuery } from "convex/nextjs";

export async function generateMetadata({ params }: any) {
    const { _teamid } = params;

    return {
        title: `Sign In | TrackIt`,
        description: `Sign in to your TrackIt account to get started.`,
    };
}

export default function ProductWrapper({ params }: any) {
    return <Page />;
}
