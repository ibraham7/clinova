import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "../content/siteContent";
import { api, messageFor } from "./api";

/** Loads the saved site content and saves changes straight to GitHub (each save publishes the site). */
export function useAdminContent() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [sha, setSha] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const result = await api.load();
        if (result.status !== 200) { setError(messageFor(result.data.error)); return; }
        setContent(result.data.content);
        setSha(result.data.sha);
        setError(null);
    }, []);

    useEffect(() => {
        let live = true;
        void api.load().then((result) => {
            if (!live) return;
            if (result.status !== 200) { setError(messageFor(result.data.error)); return; }
            setContent(result.data.content);
            setSha(result.data.sha);
        });
        return () => { live = false; };
    }, []);

    const save = useCallback(async (next: SiteContent) => {
        if (!content) return messageFor();
        setSaving(true);
        const result = await api.save(next, sha, content);
        setSaving(false);
        if (result.status !== 200) {
            if (result.data.error === "conflict") void load();
            return messageFor(result.data.error);
        }
        // The saved file, with any edits saved meanwhile from elsewhere.
        setContent(result.data.content ?? next);
        setSha(result.data.sha);
        return null;
    }, [content, sha, load]);

    return { content, error, saving, save, reload: load };
}
