export const ROUTE_DEFINITIONS = [
    { path: "/", tabKey: "home" },
    { path: "/news", tabKey: "news" },
    { path: "/research", tabKey: "research" },
    {
        path: "/research/computer-vision-and-learning-algorithms",
        tabKey: "research",
    },
    { path: "/research/efficient-learning-for-llms", tabKey: "research" },
    { path: "/research/robot-learning", tabKey: "research" },
    { path: "/research/industrial-and-medical-ai", tabKey: "research" },
    { path: "/publication", tabKey: "publication" },
    { path: "/people", tabKey: "people" },
    { path: "/photo", tabKey: "photo" },
    { path: "/contact", tabKey: "contact" },
    { path: "/join", tabKey: "join" },
];

export const SSG_ROUTE_PATHS = ROUTE_DEFINITIONS.map((item) => item.path);
