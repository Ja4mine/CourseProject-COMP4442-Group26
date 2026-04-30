(() => {
    const { useEffect, useMemo, useRef, useState } = React;

    const LANGUAGE_OVERRIDE_STORAGE_KEY = "moodwall.language.override";
    const THEME_OVERRIDE_STORAGE_KEY = "moodwall.theme.override";
    const ANON_STORAGE_KEY = "moodwall.anonymous.id";

    const TRANSLATIONS = {
        en: {
            pageTitle: "Mood Wall | PolyU",
            eyebrow: "Campus Pulse",
            mainTitle: "Mood Wall",
            languageEnglish: "English",
            languageZhHans: "简体",
            languageZhHant: "繁體",
            themeToggleDark: "Dark Mode",
            themeToggleLight: "Light Mode",
            mobileViewPost: "Post",
            mobileViewBrowse: "Browse",
            socketStatusTitle: "WebSocket connection status",
            socketDisconnected: "Realtime disconnected",
            socketConnected: "Realtime connected",
            socketMissing: "Realtime library missing",
            composerTitle: "Share Your Mood",
            composerCopy: "Post anonymously with no login required. Share your stress, joy, or rants and sync with everyone instantly.",
            labelContent: "Content",
            contentPlaceholder: "Example: I started the lab only 2 hours before deadline...",
            labelImageUrl: "Image URL (optional)",
            imageUrlPlaceholder: "https://example.com/image.jpg",
            postButton: "Post to Mood Wall",
            postingButton: "Posting...",
            anonymousIdLabel: "Anonymous ID",
            tabApproved: "Approved",
            tabTop: "Hot Posts Board",
            tabLive: "Live Stream",
            sortByTime: "By Time",
            sortByLikes: "By Likes",
            refreshButton: "Refresh",
            insightsTitle: "Live Snapshot",
            metricApprovedLabel: "Approved Posts",
            metricTopLabel: "Top 24h",
            metricLiveLabel: "Live Events",
            hotTitle: "Top Pulse",
            activityTitle: "Live Activity",
            emptyApproved: "No approved posts yet. Create one first, or switch to Top 24h.",
            emptyTop: "No hot posts in the last 24h yet.",
            emptyLive: "Waiting for realtime events...",
            emptyPost: "(empty post)",
            statusApproved: "APPROVED",
            statusPending: "PENDING",
            statusUnknown: "UNKNOWN",
            likeButton: "Like ({count})",
            commentButton: "Comment ({count})",
            commentPlaceholder: "Write a comment...",
            sendCommentButton: "Send Comment",
            toastRefreshFailed: "Refresh failed. Please check if service is running.",
            toastEmptyContent: "Content cannot be empty.",
            toastPostSuccess: "Posted successfully and added to live stream.",
            toastPostFailed: "Post failed. Please try again.",
            toastLikeNoId: "Cannot like an unsaved post.",
            toastLikeFailed: "Like failed.",
            toastCommentNoId: "Cannot comment on an unsaved post.",
            toastCommentSent: "Comment sent.",
            toastCommentFailed: "Comment failed.",
            activityNewPost: "New post #{postId} published",
            activityLike: "Post #{postId} got one like",
            activityComment: "Post #{postId} has a new comment: {comment}",
            activityRealtimePost: "Realtime new post #{postId}",
            activityRealtimeLike: "Realtime like update #{postId}",
            activityRealtimeComment: "Realtime comment #{postId}: {comment}",
            activityParsePostFail: "Received a post event but failed to parse",
            activityParseLikeFail: "Received a like event but failed to parse",
            activityParseCommentFail: "Received a comment event but failed to parse",
            hotNoData: "No data yet",
            hotItem: "#{postId} · {content} · {likeCount} likes",
            aiReplyPrefix: "AI",
            justNow: "just now"
        },
        "zh-Hans": {
            pageTitle: "心情墙 | PolyU",
            eyebrow: "校园脉搏",
            mainTitle: "Mood Wall",
            languageEnglish: "English",
            languageZhHans: "简体",
            languageZhHant: "繁體",
            themeToggleDark: "深色模式",
            themeToggleLight: "浅色模式",
            mobileViewPost: "发布",
            mobileViewBrowse: "浏览",
            socketStatusTitle: "WebSocket 连接状态",
            socketDisconnected: "实时连接已断开",
            socketConnected: "实时连接已连接",
            socketMissing: "实时库未加载",
            composerTitle: "分享你的心情",
            composerCopy: "匿名发帖，无需登录。写下今天的压力、开心或吐槽，系统会实时同步给大家。",
            labelContent: "内容",
            contentPlaceholder: "例如：今天 lab 截止前 2 小时才开始写...",
            labelImageUrl: "图片链接（可选）",
            imageUrlPlaceholder: "https://example.com/image.jpg",
            postButton: "发布到心情墙",
            postingButton: "发布中...",
            anonymousIdLabel: "匿名 ID",
            tabApproved: "已通过",
            tabTop: "热帖板块",
            tabLive: "实时流",
            sortByTime: "按时间",
            sortByLikes: "按点赞",
            refreshButton: "刷新",
            insightsTitle: "实时概览",
            metricApprovedLabel: "已通过帖子",
            metricTopLabel: "24h 热帖",
            metricLiveLabel: "实时事件",
            hotTitle: "热门脉搏",
            activityTitle: "实时动态",
            emptyApproved: "当前还没有已通过帖子。可以先发一条，或切换到 24h 热帖查看。",
            emptyTop: "暂时还没有 24h 热帖数据。",
            emptyLive: "等待实时消息进入...",
            emptyPost: "（空帖子）",
            statusApproved: "已通过",
            statusPending: "待审核",
            statusUnknown: "未知",
            likeButton: "点赞 ({count})",
            commentButton: "评论 ({count})",
            commentPlaceholder: "写下评论...",
            sendCommentButton: "发送评论",
            toastRefreshFailed: "刷新失败，请检查服务是否启动。",
            toastEmptyContent: "内容不能为空。",
            toastPostSuccess: "发布成功，已加入实时流。",
            toastPostFailed: "发帖失败，请稍后重试。",
            toastLikeNoId: "无法点赞未保存帖子。",
            toastLikeFailed: "点赞失败。",
            toastCommentNoId: "无法评论未保存帖子。",
            toastCommentSent: "评论已发送。",
            toastCommentFailed: "评论失败。",
            activityNewPost: "新帖 #{postId} 已发布",
            activityLike: "帖子 #{postId} 收到一个赞",
            activityComment: "帖子 #{postId} 有新评论: {comment}",
            activityRealtimePost: "实时收到新帖 #{postId}",
            activityRealtimeLike: "实时点赞更新 #{postId}",
            activityRealtimeComment: "实时评论 #{postId}: {comment}",
            activityParsePostFail: "收到帖子消息但解析失败",
            activityParseLikeFail: "收到点赞消息但解析失败",
            activityParseCommentFail: "收到评论消息但解析失败",
            hotNoData: "暂无数据",
            hotItem: "#{postId} · {content} · {likeCount} 赞",
            aiReplyPrefix: "AI",
            justNow: "刚刚"
        },
        "zh-Hant": {
            pageTitle: "心情牆 | PolyU",
            eyebrow: "校園脈搏",
            mainTitle: "Mood Wall",
            languageEnglish: "English",
            languageZhHans: "简体",
            languageZhHant: "繁體",
            themeToggleDark: "深色模式",
            themeToggleLight: "淺色模式",
            mobileViewPost: "發布",
            mobileViewBrowse: "瀏覽",
            socketStatusTitle: "WebSocket 連線狀態",
            socketDisconnected: "即時連線已中斷",
            socketConnected: "即時連線已連接",
            socketMissing: "即時函式庫未載入",
            composerTitle: "分享你的心情",
            composerCopy: "匿名發帖，無需登入。寫下今天的壓力、開心或吐槽，系統會即時同步給大家。",
            labelContent: "內容",
            contentPlaceholder: "例如：今天 lab 截止前 2 小時才開始寫...",
            labelImageUrl: "圖片連結（可選）",
            imageUrlPlaceholder: "https://example.com/image.jpg",
            postButton: "發布到心情牆",
            postingButton: "發布中...",
            anonymousIdLabel: "匿名 ID",
            tabApproved: "已通過",
            tabTop: "熱帖板塊",
            tabLive: "即時流",
            sortByTime: "按時間",
            sortByLikes: "按點讚",
            refreshButton: "刷新",
            insightsTitle: "即時概覽",
            metricApprovedLabel: "已通過帖子",
            metricTopLabel: "24h 熱帖",
            metricLiveLabel: "即時事件",
            hotTitle: "熱門脈搏",
            activityTitle: "即時動態",
            emptyApproved: "目前還沒有已通過帖子。可以先發一條，或切換到 24h 熱帖查看。",
            emptyTop: "暫時還沒有 24h 熱帖資料。",
            emptyLive: "等待即時訊息進入...",
            emptyPost: "（空帖子）",
            statusApproved: "已通過",
            statusPending: "待審核",
            statusUnknown: "未知",
            likeButton: "點讚 ({count})",
            commentButton: "評論 ({count})",
            commentPlaceholder: "寫下評論...",
            sendCommentButton: "發送評論",
            toastRefreshFailed: "刷新失敗，請檢查服務是否啟動。",
            toastEmptyContent: "內容不能為空。",
            toastPostSuccess: "發布成功，已加入即時流。",
            toastPostFailed: "發帖失敗，請稍後重試。",
            toastLikeNoId: "無法點讚未保存帖子。",
            toastLikeFailed: "點讚失敗。",
            toastCommentNoId: "無法評論未保存帖子。",
            toastCommentSent: "評論已發送。",
            toastCommentFailed: "評論失敗。",
            activityNewPost: "新帖 #{postId} 已發布",
            activityLike: "帖子 #{postId} 收到一個讚",
            activityComment: "帖子 #{postId} 有新評論: {comment}",
            activityRealtimePost: "即時收到新帖 #{postId}",
            activityRealtimeLike: "即時點讚更新 #{postId}",
            activityRealtimeComment: "即時評論 #{postId}: {comment}",
            activityParsePostFail: "收到帖子訊息但解析失敗",
            activityParseLikeFail: "收到點讚訊息但解析失敗",
            activityParseCommentFail: "收到評論訊息但解析失敗",
            hotNoData: "暫無資料",
            hotItem: "#{postId} · {content} · {likeCount} 讚",
            aiReplyPrefix: "AI",
            justNow: "剛剛"
        }
    };

    const LOCALE_BY_LANGUAGE = {
        en: "en-US",
        "zh-Hans": "zh-CN",
        "zh-Hant": "zh-HK"
    };

    function normalizeLanguage(language) {
        const value = String(language || "").toLowerCase();
        if (value.startsWith("zh-cn") || value.startsWith("zh-sg") || value.includes("hans")) {
            return "zh-Hans";
        }

        if (value.startsWith("zh") || value.includes("hant")) {
            return "zh-Hant";
        }

        if (value.startsWith("en")) {
            return "en";
        }

        return null;
    }

    function getInitialLanguage() {
        const savedOverride = localStorage.getItem(LANGUAGE_OVERRIDE_STORAGE_KEY);
        if (savedOverride) {
            return normalizeLanguage(savedOverride) || "en";
        }

        const candidates = Array.isArray(window.navigator.languages) && window.navigator.languages.length
            ? window.navigator.languages
            : [window.navigator.language];

        for (const candidate of candidates) {
            const matched = normalizeLanguage(candidate);
            if (matched) {
                return matched;
            }
        }

        return "en";
    }

    function getInitialTheme() {
        const savedOverride = localStorage.getItem(THEME_OVERRIDE_STORAGE_KEY);
        if (savedOverride === "dark" || savedOverride === "light") {
            return savedOverride;
        }

        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        return "light";
    }

    function getOrCreateAnonymousId() {
        const existing = localStorage.getItem(ANON_STORAGE_KEY);
        if (existing) {
            return existing;
        }

        const id = `web-${randomHex(12)}`;
        localStorage.setItem(ANON_STORAGE_KEY, id);
        return id;
    }

    function randomHex(length) {
        const alphabet = "abcdef0123456789";
        if (window.crypto && window.crypto.getRandomValues) {
            const bytes = new Uint8Array(length);
            window.crypto.getRandomValues(bytes);
            return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
        }

        let fallback = "";
        for (let i = 0; i < length; i += 1) {
            fallback += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return fallback;
    }

    function translate(language, key, params = {}) {
        const current = TRANSLATIONS[language] || TRANSLATIONS.en;
        const fallback = TRANSLATIONS.en;
        const template = current[key] || fallback[key] || key;
        return String(template).replace(/\{(\w+)\}/g, (_, token) => {
            if (!(token in params)) {
                return `{${token}}`;
            }

            return String(params[token]);
        });
    }

    function prependUnique(list, post) {
        if (!post) {
            return list;
        }

        if (!post.id) {
            return [post, ...list].slice(0, 60);
        }

        const index = list.findIndex((item) => item && item.id === post.id);
        if (index >= 0) {
            const next = [...list];
            next[index] = post;
            return next;
        }

        return [post, ...list].slice(0, 60);
    }

    function PostCard({ post, t, onLike, onComment, locale, onUpdateComments }) {
        const [commentOpen, setCommentOpen] = useState(false);
        const [commentValue, setCommentValue] = useState("");

        async function loadComments() {
            if (post.comments && post.comments.length > 0) return;
            try {
                const response = await fetch(`/api/posts/${post.id}/comments`);
                if (response.ok) {
                    const data = await response.json();
                    const postComments = data.filter(interaction => interaction.type === 'COMMENT');
                    onUpdateComments(post.id, postComments);
                }
            } catch (error) {
                console.error("Failed to load comments", error);
            }
        }

        function statusClass(status) {
            if (status === "APPROVED") {
                return "status-approved";
            }

            if (status === "PENDING") {
                return "status-pending";
            }

            return "status-other";
        }

        function toNumber(value) {
            const numberValue = Number(value);
            return Number.isFinite(numberValue) ? numberValue : 0;
        }

        function formatDate(value) {
            if (!value) {
                return t("justNow");
            }

            const date = new Date(value);
            if (Number.isNaN(date.getTime())) {
                return String(value);
            }

            return date.toLocaleString(locale, { hour12: false, timeZone: "Asia/Shanghai" });
        }

        function handleCommentSubmit(event) {
            event.preventDefault();
            const trimmed = commentValue.trim();
            if (!trimmed) {
                return;
            }

            onComment(post.id, trimmed);
            setCommentValue("");
        }

        return (
            <article className="post-card reveal">
                <div className="post-head">
                    <span className="post-meta">#{post.id ?? "-"} • {formatDate(post.createTime)}</span>
                    <span className={`status ${statusClass(post.status)}`} aria-hidden="true"></span>
                </div>

                <p className="post-content">{post.content || t("emptyPost")}</p>

                {post.imageUrl ? (
                    <img className="post-image" src={post.imageUrl} alt="Post image" loading="lazy" />
                ) : null}

                {Array.isArray(post.emotionTags) && post.emotionTags.length > 0 ? (
                    <ul className="tag-list">
                        {post.emotionTags.map((tag, index) => (
                            <li key={`${tag}-${index}`}>{String(tag).trim()}</li>
                        ))}
                    </ul>
                ) : null}

                {post.aiReply ? (
                    <div className="ai-reply">{t("aiReplyPrefix")}: {post.aiReply}</div>
                ) : null}

                <div>
                    <div className="post-actions">
                        <button className="action-button" type="button" onClick={() => onLike(post.id)}>
                            {t("likeButton", { count: toNumber(post.likeCount) })}
                        </button>
                        <button className="action-button" type="button" onClick={() => {
                            setCommentOpen((open) => !open);
                            if (!commentOpen) {
                                loadComments();
                            }
                        }}>
                            {t("commentButton", { count: toNumber(post.commentCount) })}
                        </button>
                    </div>

                    <form className={`comment-box ${commentOpen ? "open" : ""}`} onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            value={commentValue}
                            onChange={(event) => setCommentValue(event.target.value)}
                            placeholder={t("commentPlaceholder")}
                            maxLength={200}
                            required
                        />
                        <button type="submit">{t("sendCommentButton")}</button>
                    </form>

                    {commentOpen && post.comments && post.comments.length > 0 && (
                        <div className="comments-list">
                            {post.comments.map((comment, index) => (
                                <div key={comment.id ?? index} className="comment-item">
                                    <p className="comment-item-content">{comment.content}</p>
                                    <span className="comment-item-time">{formatDate(comment.timestamp)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        );
    }

    function App() {
        const [language, setLanguageState] = useState(getInitialLanguage);
        const [theme, setTheme] = useState(getInitialTheme);
        const [mobileView, setMobileView] = useState("browse");
        const [sortMode, setSortMode] = useState("time");
        const [anonymousId, setAnonymousId] = useState("");
        const [content, setContent] = useState("");
        const [imageUrl, setImageUrl] = useState("");
        const [topPosts, setTopPosts] = useState([]);
        const [liveEvents, setLiveEvents] = useState([]);
        const [connected, setConnected] = useState(false);
        const [connectionTextKey, setConnectionTextKey] = useState("socketDisconnected");
        const [posting, setPosting] = useState(false);
        const [refreshing, setRefreshing] = useState(false);
        const [toasts, setToasts] = useState([]);

        const stompClientRef = useRef(null);
        const reconnectTimerRef = useRef(null);
        const pendingCommentEchoRef = useRef(new Map());

        function t(key, params = {}) {
            return translate(language, key, params);
        }

        const locale = LOCALE_BY_LANGUAGE[language] || "en-US";

        useEffect(() => {
            setAnonymousId(getOrCreateAnonymousId());
        }, []);

        useEffect(() => {
            document.documentElement.lang = language;
            document.title = t("pageTitle");
        }, [language]);

        useEffect(() => {
            document.body.classList.toggle("theme-dark", theme === "dark");
            document.body.classList.toggle("theme-light", theme !== "dark");
        }, [theme]);

        useEffect(() => {
            refreshAll();
            connectWebSocket();

            return () => {
                if (reconnectTimerRef.current) {
                    clearTimeout(reconnectTimerRef.current);
                    reconnectTimerRef.current = null;
                }

                if (stompClientRef.current) {
                    try {
                        stompClientRef.current.disconnect(() => {});
                    } catch (error) {
                        // Ignore close errors on shutdown.
                    }
                    stompClientRef.current = null;
                }
            };
        }, []);

        function setLanguage(nextLanguage, persist = false) {
            const normalized = normalizeLanguage(nextLanguage) || "en";
            setLanguageState(normalized);
            if (persist) {
                localStorage.setItem(LANGUAGE_OVERRIDE_STORAGE_KEY, normalized);
            }
        }

        function toggleTheme() {
            const nextTheme = theme === "dark" ? "light" : "dark";
            setTheme(nextTheme);
            localStorage.setItem(THEME_OVERRIDE_STORAGE_KEY, nextTheme);
        }

        function showToast(message, type) {
            const toastId = `${Date.now()}-${Math.random()}`;
            setToasts((previous) => [...previous, { id: toastId, message, type }]);

            window.setTimeout(() => {
                setToasts((previous) => previous.filter((toast) => toast.id !== toastId));
            }, 2200);
        }

        async function loadTopPosts() {
            const response = await fetch("/api/posts/top?limit=20");
            if (!response.ok) {
                throw new Error("load top posts failed");
            }

            const posts = await response.json();
            // Initialize comments array for each post
            return Array.isArray(posts) ? posts.map(post => ({ ...post, comments: [] })) : [];
        }

        function markPendingCommentEcho(postId, comment) {
            if (!postId || !comment) {
                return;
            }

            const current = pendingCommentEchoRef.current.get(postId) || new Set();
            current.add(comment);
            pendingCommentEchoRef.current.set(postId, current);
        }

        function consumePendingCommentEcho(postId, comment) {
            if (!postId || !comment) {
                return false;
            }

            const current = pendingCommentEchoRef.current.get(postId);
            if (!current || !current.has(comment)) {
                return false;
            }

            current.delete(comment);
            if (current.size === 0) {
                pendingCommentEchoRef.current.delete(postId);
            }

            return true;
        }

        async function hydrateMissingCommentCounts(posts) {
            const targets = (posts || []).filter((post) => post && post.id && post.status === "APPROVED" && Number(post.commentCount) === 0);

            await Promise.all(targets.map(async (post) => {
                try {
                    const response = await fetch(`/api/posts/${post.id}/comments`);
                    if (!response.ok) {
                        return;
                    }

                    const data = await response.json();
                    const comments = Array.isArray(data)
                        ? data.filter((interaction) => interaction && interaction.type === "COMMENT")
                        : [];

                    if (comments.length > 0) {
                        updatePostById(post.id, (currentPost) => ({
                            ...currentPost,
                            commentCount: comments.length,
                            comments: currentPost.comments && currentPost.comments.length > 0 ? currentPost.comments : comments
                        }));
                    }
                } catch (error) {
                    console.error("Failed to hydrate comment count", error);
                }
            }));
        }

        async function refreshAll() {
            setRefreshing(true);
            try {
                const top = await loadTopPosts();
                setTopPosts(top);
                hydrateMissingCommentCounts(top);
            } catch (error) {
                showToast(t("toastRefreshFailed"), "error");
            } finally {
                setRefreshing(false);
            }
        }

        function appendActivity(messageKey, params = {}) {
            setLiveEvents((previous) => [{
                time: new Date().toISOString(),
                messageKey,
                params
            }, ...previous].slice(0, 18));
        }

        function publish(destination, payload) {
            const client = stompClientRef.current;
            if (!client || !connected) {
                return;
            }

            client.send(destination, {}, JSON.stringify(payload));
        }

        function setConnectionState(isConnected, textKey) {
            setConnected(isConnected);
            setConnectionTextKey(textKey);
        }

        function updatePostById(postId, updater) {
            setTopPosts((previous) => previous.map((post) => post.id === postId ? updater(post) : post));
        }

        function updatePostComments(postId, comments) {
            updatePostById(postId, (post) => ({
                ...post,
                comments,
                commentCount: comments.length
            }));
        }

        function findPostById(postId) {
            return topPosts.find((post) => post.id === postId);
        }

        function connectWebSocket() {
            if (!window.SockJS || !window.StompJs) {
                setConnectionState(false, "socketMissing");
                return;
            }

            const socket = new window.SockJS("/ws");
            const client = window.StompJs.Stomp.over(socket);
            client.debug = () => {};

            client.connect(
                {},
                () => {
                    stompClientRef.current = client;
                    setConnectionState(true, "socketConnected");

                    client.subscribe("/topic/posts", (message) => {
                        try {
                            const post = JSON.parse(message.body);
                            // Initialize comments array for new post
                            post.comments = post.comments || [];
                            setTopPosts((previous) => prependUnique(previous, post));
                            appendActivity("activityRealtimePost", { postId: post.id ?? "-" });
                        } catch (error) {
                            appendActivity("activityParsePostFail");
                        }
                    });

                    client.subscribe("/topic/likes", (message) => {
                        try {
                            const event = JSON.parse(message.body);
                            if (event.postId) {
                                updatePostById(event.postId, (post) => {
                                    const next = { ...post };
                                    next.likeCount = Number.isFinite(Number(event.likeCount))
                                        ? Number(event.likeCount)
                                        : (Number(post.likeCount) || 0) + 1;
                                    return next;
                                });
                                appendActivity("activityRealtimeLike", { postId: event.postId });
                            }
                        } catch (error) {
                            appendActivity("activityParseLikeFail");
                        }
                    });

                    client.subscribe("/topic/comments", (message) => {
                        try {
                            const event = JSON.parse(message.body);
                            if (event.postId) {
                                const isPendingEcho = consumePendingCommentEcho(event.postId, event.comment);
                                updatePostById(event.postId, (post) => {
                                    const next = { ...post };
                                    if (!isPendingEcho) {
                                        next.commentCount = (Number(post.commentCount) || 0) + 1;

                                        const newComment = {
                                            id: Date.now(),
                                            content: event.comment,
                                            timestamp: new Date().toISOString(),
                                            type: "COMMENT"
                                        };
                                        next.comments = [newComment, ...(next.comments || [])];
                                    }

                                    return next;
                                });
                                appendActivity("activityRealtimeComment", {
                                    postId: event.postId,
                                    comment: truncate(event.comment, 24)
                                });
                            }
                        } catch (error) {
                            appendActivity("activityParseCommentFail");
                        }
                    });
                },
                () => {
                    setConnectionState(false, "socketDisconnected");
                    scheduleReconnect();
                }
            );
        }

        function scheduleReconnect() {
            if (reconnectTimerRef.current) {
                return;
            }

            reconnectTimerRef.current = window.setTimeout(() => {
                reconnectTimerRef.current = null;
                connectWebSocket();
            }, 2500);
        }

        async function onCreatePost(event) {
            event.preventDefault();
            const trimmedContent = content.trim();
            const trimmedImageUrl = imageUrl.trim();

            if (!trimmedContent) {
                showToast(t("toastEmptyContent"), "error");
                return;
            }

            setPosting(true);
            try {
                const response = await fetch("/api/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Anonymous-Id": anonymousId
                    },
                    body: JSON.stringify({
                        content: trimmedContent,
                        imageUrl: trimmedImageUrl
                    })
                });

                if (!response.ok) {
                    throw new Error(`create post failed: ${response.status}`);
                }

                const post = await response.json();
                // Initialize comments array for new post
                post.comments = [];
                setTopPosts((previous) => prependUnique(previous, post));

                showToast(t("toastPostSuccess"), "success");
                appendActivity("activityNewPost", { postId: post.id ?? "-" });

                if (connected) {
                    publish("/app/post.new", post);
                }

                if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) {
                    setMobileView("browse");
                }

                setContent("");
                setImageUrl("");
            } catch (error) {
                showToast(t("toastPostFailed"), "error");
            } finally {
                setPosting(false);
            }
        }

        async function onLike(postId) {
            if (!postId) {
                showToast(t("toastLikeNoId"), "error");
                return;
            }

            try {
                const response = await fetch(`/api/posts/${postId}/like`, {
                    method: "POST",
                    headers: {
                        "X-Anonymous-Id": anonymousId
                    }
                });

                if (!response.ok) {
                    throw new Error(`like failed: ${response.status}`);
                }
            } catch (error) {
                showToast(t("toastLikeFailed"), "error");
            }
        }

        async function onComment(postId, comment) {
            if (!postId) {
                showToast(t("toastCommentNoId"), "error");
                return;
            }

            try {
                const response = await fetch(`/api/posts/${postId}/comment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain",
                        "X-Anonymous-Id": anonymousId
                    },
                    body: comment
                });

                if (!response.ok) {
                    throw new Error(`comment failed: ${response.status}`);
                }

                markPendingCommentEcho(postId, comment);
                updatePostById(postId, (post) => {
                    const nextComment = {
                        id: Date.now(),
                        content: comment,
                        timestamp: new Date().toISOString(),
                        type: "COMMENT"
                    };

                    return {
                        ...post,
                        commentCount: (Number(post.commentCount) || 0) + 1,
                        comments: [nextComment, ...(post.comments || [])]
                    };
                });

                showToast(t("toastCommentSent"), "success");
            } catch (error) {
                showToast(t("toastCommentFailed"), "error");
            }
        }

        const feedPosts = useMemo(() => {
            const next = [...topPosts];

            function toNumber(value) {
                const numberValue = Number(value);
                return Number.isFinite(numberValue) ? numberValue : 0;
            }

            function toTimestamp(value) {
                const timeValue = new Date(value || 0).getTime();
                return Number.isFinite(timeValue) ? timeValue : 0;
            }

            if (sortMode === "likes") {
                next.sort((a, b) => {
                    const likeDiff = toNumber(b.likeCount) - toNumber(a.likeCount);
                    if (likeDiff !== 0) {
                        return likeDiff;
                    }

                    return toTimestamp(b.createTime) - toTimestamp(a.createTime);
                });
                return next;
            }

            next.sort((a, b) => {
                const timeDiff = toTimestamp(b.createTime) - toTimestamp(a.createTime);
                if (timeDiff !== 0) {
                    return timeDiff;
                }

                return toNumber(b.likeCount) - toNumber(a.likeCount);
            });
            return next;
        }, [topPosts, sortMode]);

        return (
            <>
                <div className="backdrop" aria-hidden="true">
                    <span className="orb orb-a"></span>
                    <span className="orb orb-b"></span>
                    <span className="orb orb-c"></span>
                </div>

                <header className="topbar reveal">
                    <div>
                        <p className="eyebrow">{t("eyebrow")}</p>
                        <h1 className="title">{t("mainTitle")}</h1>
                    </div>
                    <div className="topbar-tools">
                        <div className="language-switch toolbar-control" aria-label="Language switch">
                            <button
                                className={`language-button ${language === "en" ? "active" : ""}`}
                                type="button"
                                onClick={() => setLanguage("en", true)}
                            >
                                {t("languageEnglish")}
                            </button>
                            <button
                                className={`language-button ${language === "zh-Hans" ? "active" : ""}`}
                                type="button"
                                onClick={() => setLanguage("zh-Hans", true)}
                            >
                                {t("languageZhHans")}
                            </button>
                            <button
                                className={`language-button ${language === "zh-Hant" ? "active" : ""}`}
                                type="button"
                                onClick={() => setLanguage("zh-Hant", true)}
                            >
                                {t("languageZhHant")}
                            </button>
                        </div>
                        <button className="ghost-button theme-toggle toolbar-control" type="button" onClick={toggleTheme}>
                            {theme === "dark" ? t("themeToggleLight") : t("themeToggleDark")}
                        </button>
                        <div className="socket-status toolbar-control" title={t("socketStatusTitle")}>
                            <span className={`socket-dot ${connected ? "online" : "offline"}`}></span>
                            <span>{t(connectionTextKey)}</span>
                        </div>
                    </div>
                </header>

                <div className="mobile-view-switch">
                    <button
                        className={`mobile-view-button ${mobileView === "post" ? "active" : ""}`}
                        type="button"
                        onClick={() => setMobileView("post")}
                    >
                        {t("mobileViewPost")}
                    </button>
                    <button
                        className={`mobile-view-button ${mobileView === "browse" ? "active" : ""}`}
                        type="button"
                        onClick={() => setMobileView("browse")}
                    >
                        {t("mobileViewBrowse")}
                    </button>
                </div>

                <main className={`layout mobile-${mobileView}`}>
                    <section className="composer panel reveal">
                        <h2>{t("composerTitle")}</h2>
                        <p className="panel-copy">{t("composerCopy")}</p>

                        <form className="post-form" onSubmit={onCreatePost}>
                            <label htmlFor="content" className="field-label">{t("labelContent")}</label>
                            <textarea
                                id="content"
                                name="content"
                                maxLength={500}
                                placeholder={t("contentPlaceholder")}
                                required
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                            ></textarea>

                            <label htmlFor="imageUrl" className="field-label">{t("labelImageUrl")}</label>
                            <input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                placeholder={t("imageUrlPlaceholder")}
                                value={imageUrl}
                                onChange={(event) => setImageUrl(event.target.value)}
                            />

                            <div className="form-row">
                                <button id="postButton" type="submit" disabled={posting}>
                                    {posting ? t("postingButton") : t("postButton")}
                                </button>
                                <p className="anon-id">{t("anonymousIdLabel")}: <span>{anonymousId}</span></p>
                            </div>
                        </form>
                    </section>

                    <section className="feed panel reveal">
                        <div className="feed-toolbar">
                            <h2>{t("tabTop")}</h2>
                            <div className="feed-toolbar-controls">
                                <div className="tab-group sort-group" role="group" aria-label="Sort posts">
                                    <button
                                        className={`tab ${sortMode === "time" ? "active" : ""}`}
                                        type="button"
                                        onClick={() => setSortMode("time")}
                                    >
                                        {t("sortByTime")}
                                    </button>
                                    <button
                                        className={`tab ${sortMode === "likes" ? "active" : ""}`}
                                        type="button"
                                        onClick={() => setSortMode("likes")}
                                    >
                                        {t("sortByLikes")}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="feed-list" aria-live="polite">
                            {feedPosts.length === 0 ? (
                                <div className="empty">{t("emptyTop")}</div>
                            ) : (
                                feedPosts.map((post, index) => (
                                    <PostCard
                                        key={post.id ?? `${post.createTime || "temp"}-${index}`}
                                        post={post}
                                        t={t}
                                        locale={locale}
                                        onLike={onLike}
                                        onComment={onComment}
                                        onUpdateComments={updatePostComments}
                                    />
                                ))
                            )}
                        </div>
                    </section>

                    <aside className="insights panel reveal">
                        <h2>{t("insightsTitle")}</h2>
                        <div className="metric-grid">
                            <article>
                                <p className="metric-label">{t("metricTopLabel")}</p>
                                <p className="metric-value">{topPosts.length}</p>
                            </article>
                            <article>
                                <p className="metric-label">{t("metricLiveLabel")}</p>
                                <p className="metric-value">{liveEvents.length}</p>
                            </article>
                        </div>

                        <h3>{t("hotTitle")}</h3>
                        <ol className="hot-list">
                            {topPosts.length === 0 ? (
                                <li>{t("hotNoData")}</li>
                            ) : (
                                topPosts.slice(0, 6).map((post) => (
                                    <li key={`hot-${post.id ?? Math.random()}`}>
                                        {t("hotItem", {
                                            postId: post.id ?? "-",
                                            content: truncate(post.content || "", 28),
                                            likeCount: Number(post.likeCount) || 0
                                        })}
                                    </li>
                                ))
                            )}
                        </ol>

                        <h3>{t("activityTitle")}</h3>
                        <ul className="activity-list">
                            {liveEvents.length === 0 ? (
                                <li>{t("emptyLive")}</li>
                            ) : (
                                liveEvents.map((eventItem, index) => {
                                    const date = new Date(eventItem.time);
                                    const stamp = Number.isNaN(date.getTime())
                                        ? "--:--:--"
                                        : date.toLocaleTimeString(locale, { hour12: false });
                                    const message = t(eventItem.messageKey, eventItem.params);
                                    return <li key={`act-${eventItem.time}-${index}`}>[{stamp}] {message}</li>;
                                })
                            )}
                        </ul>
                    </aside>
                </main>

                <div className="toast-stack" aria-live="assertive" aria-atomic="true">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}
                        >
                            {toast.message}
                        </div>
                    ))}
                </div>
            </>
        );
    }

    function truncate(text, length) {
        if (!text) {
            return "";
        }

        if (text.length <= length) {
            return text;
        }

        return `${text.slice(0, length)}...`;
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
