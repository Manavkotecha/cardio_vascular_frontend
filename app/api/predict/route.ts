// Simple API Route to proxy prediction requests to Render backend

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const BACKEND_URL = 'https://cardio-vascular-backend.onrender.com';

    try {
        // Get the request body
        const body = await request.json();

        // Make request to Render backend
        const backendResponse = await fetch(`${BACKEND_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Get response as text first
        const text = await backendResponse.text();

        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { raw: text };
        }

        // Return with same status
        return NextResponse.json(data, { status: backendResponse.status });

    } catch (error) {
        // Return error details
        return NextResponse.json(
            { error: String(error) },
            { status: 500 }
        );
    }
}
