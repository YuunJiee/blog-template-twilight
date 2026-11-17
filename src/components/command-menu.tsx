"use client";

import * as React from "react";
import { PostType } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    FileText,
    Home,
    User,
    Briefcase,
    Search,
    Code2,
    Mail,
} from "lucide-react";

/** Dispatch this on window to open the menu (e.g. from a navbar button). */
export const OPEN_COMMAND_MENU_EVENT = "open-command-menu";

interface CommandMenuProps {
    posts: {
        id: string;
        title: string;
        tags?: string[];
        type?: PostType;
    }[];
}

const FUSE_OPTIONS = {
    keys: [
        { name: 'name', weight: 0.8 },
        { name: 'searchExtra', weight: 0.2 },
    ],
    threshold: 0.4,
    includeScore: true as const,
    ignoreLocation: true,
    minMatchCharLength: 1,
};

type CommandItem = {
    name: string;
    icon: React.ElementType;
    action: () => void;
    /** Extra text for fuzzy matching (e.g. tags) */
    searchExtra?: string;
};

type CommandGroup = {
    name: string;
    items: CommandItem[];
};

export function CommandMenu({ posts }: CommandMenuProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        const openMenu = () => setOpen(true);
        document.addEventListener("keydown", down);
        window.addEventListener(OPEN_COMMAND_MENU_EVENT, openMenu);
        return () => {
            document.removeEventListener("keydown", down);
            window.removeEventListener(OPEN_COMMAND_MENU_EVENT, openMenu);
        };
    }, []);

    // Reset query when dialog opens / closes
    React.useEffect(() => {
        if (!open) setQuery("");
    }, [open]);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    // ── Groups — stable reference, only rebuilt when the posts prop changes ───
    const groups: CommandGroup[] = React.useMemo(() => {
        // Use `type` field for routing classification; fall back to tag for backward compat.
        const blogPosts = (posts || []).filter(p => p.title && p.type !== PostType.LEETCODE);
        const lcPosts   = (posts || []).filter(p => p.title && p.type === PostType.LEETCODE);
        return [
            {
                name: "Pages",
                items: [
                    { name: "Home",      icon: Home,     action: () => router.push("/") },
                    { name: "Blog",      icon: FileText,  action: () => router.push("/blog") },
                    ...(siteConfig.showLeetCode
                        ? [{ name: "LeetCode", icon: Code2, action: () => router.push("/leetcode") }]
                        : []),
                    { name: "Projects", icon: Briefcase, action: () => router.push("/projects") },
                    { name: "About",    icon: User,      action: () => router.push("/about") },
                    { name: "Contact",  icon: Mail,      action: () => router.push("/contact") },
                ],
            },
            {
                name: "Blog Posts",
                items: blogPosts.map(post => ({
                    name: post.title,
                    icon: FileText,
                    action: () => router.push(`/blog/${post.id}`),
                    searchExtra: post.tags?.join(' ') ?? '',
                })),
            },
            {
                name: "LeetCode",
                items: lcPosts.map(post => ({
                    name: post.title,
                    icon: Code2,
                    action: () => router.push(`/leetcode/${post.id}`),
                    searchExtra: post.tags?.join(' ') ?? '',
                })),
            },
        ];
    }, [posts, router]);

    // ── Fuse instances — rebuilt only when groups change, NOT on every keystroke ──
    const fuseInstances = React.useMemo(
        () => groups.map(group => new Fuse(group.items, FUSE_OPTIONS)),
        [groups],
    );

    // ── Fuzzy search — only the filter step re-runs per keystroke ────────────
    const filteredGroups = React.useMemo(() => {
        const trimmed = query.trim();
        if (!trimmed) return groups.filter(group => group.items.length > 0);

        return groups
            .map((group, i) => ({
                ...group,
                items: fuseInstances[i]!.search(trimmed).map((r) => r.item),
            }))
            .filter(group => group.items.length > 0);
    }, [query, groups, fuseInstances]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 overflow-hidden max-w-lg gap-0 [&>button]:hidden">
                <DialogHeader className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <div className="text-xs text-muted-foreground border px-1.5 py-0.5 rounded bg-muted">ESC</div>
                    </div>
                    <DialogTitle className="sr-only">Command Menu</DialogTitle>
                    <DialogDescription className="sr-only">
                        Search for posts and pages.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto py-2">
                    {filteredGroups.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No results found.
                        </div>
                    ) : (
                        filteredGroups.map((group) => (
                            <div key={group.name} className="mb-2">
                                <div className="px-4 py-1 text-xs font-semibold text-muted-foreground">
                                    {group.name}
                                </div>
                                {group.items.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => runCommand(item.action)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors text-left"
                                    >
                                        <item.icon className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

