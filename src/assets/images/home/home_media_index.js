import IntroGroupPhoto from "./optimized/cvl-lab-home-bg.webp";

const withBasePath = (relativePath) => {
    const basePath = import.meta.env.BASE_URL || "/";
    return `${basePath.replace(/\/+$/, "/")}${String(
        relativePath || "",
    ).replace(/^\/+/, "")}`;
};

const home_media_images = {
    intro_group_photo: IntroGroupPhoto,
    intro_meeting_room: withBasePath(
        "uploads/photos/events/2024-02-22__legacy-archive/20240222-06--thumb.jpg",
    ),
    research_environment: withBasePath(
        "uploads/photos/events/2024-08-26__legacy-archive/20240826-1-08--thumb.jpg",
    ),
    culture_seminar: withBasePath(
        "uploads/photos/events/2024-11-27__legacy-archive/20241127-11--thumb.jpg",
    ),
    culture_discussion: withBasePath(
        "uploads/photos/events/2023-12-27__legacy-archive/20231227-2-05--thumb.jpg",
    ),
};

export default home_media_images;
