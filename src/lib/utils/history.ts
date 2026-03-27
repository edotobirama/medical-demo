/**
 * Helper to handle the "historyNotes" field which now doubles as a 
 * JSON store for video call signaling metadata.
 */

export interface CallMetadata {
    callStatus?: 'RINGING' | 'CONNECTED' | 'ENDED' | 'MISSED';
    initiatedAt?: number;
    lastHeartbeat?: number;
    endedBy?: 'DOCTOR' | 'PATIENT' | null;
    endedAt?: number;
}

export function parseHistoryNotes(rawNotes: string | null): { notes: string; metadata: CallMetadata } {
    if (!rawNotes) return { notes: '', metadata: {} };

    // Check if it's a JSON object (starts with {)
    if (rawNotes.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(rawNotes);
            
            // If it has call metadata fields, separate them
            if (parsed.callStatus || parsed.initiatedAt || parsed._originalNotes !== undefined) {
                const { callStatus, initiatedAt, lastHeartbeat, endedBy, endedAt, _originalNotes, ...rest } = parsed;
                const metadata: CallMetadata = { callStatus, initiatedAt, lastHeartbeat, endedBy, endedAt };
                
                // Prioritize _originalNotes if provided
                let notes = _originalNotes || '';
                
                // Strip ALL underscore-prefixed internal keys (_sdpOffer, _sdpAnswer, _chatMessages, etc.)
                // Only append genuinely unknown display fields (non-internal)
                const displayFields = Object.fromEntries(
                    Object.entries(rest).filter(([k]) => !k.startsWith('_'))
                );
                if (Object.keys(displayFields).length > 0) {
                    const extra = JSON.stringify(displayFields);
                    notes = notes ? `${notes}\n\n${extra}` : extra;
                }
                
                return { notes, metadata };
            }
        } catch (e) {
            // Not valid JSON or parse failed, treat as raw text
        }
    }

    return { notes: rawNotes, metadata: {} };
}

export function formatHistoryNotesForSave(notes: string, metadata: CallMetadata): string {
    // If no metadata, just save as raw text (backwards compatibility)
    if (Object.keys(metadata).length === 0) return notes;

    // Otherwise save as JSON
    return JSON.stringify({
        ...metadata,
        _originalNotes: notes // Store original text here
    });
}
