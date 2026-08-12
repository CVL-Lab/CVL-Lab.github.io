import DEADLINE_DATA from "../generated/deadlines.generated.json";

const FALLBACK_AREA_LABEL = "Other";

export const DEADLINE_AREAS = (DEADLINE_DATA.meta?.area_order ?? []).map(
    (key) => ({
        key,
        label: DEADLINE_DATA.meta?.area_labels?.[key] ?? FALLBACK_AREA_LABEL,
    }),
);

export const DEADLINE_DISPLAY_TIMEZONE =
    DEADLINE_DATA.meta?.display_timezone ?? "Asia/Seoul";

export const DEADLINE_STATUS_META = {
    verified: { label: "Official CFP verified", tone: "verified" },
    awaiting_cfp: { label: "Awaiting current CFP", tone: "awaiting" },
    needs_review: { label: "Source needs review", tone: "review" },
    estimated: { label: "Estimated", tone: "estimated" },
};

const asDate = (value) => {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? null : new Date(timestamp);
};

export const getVenueStatusMeta = (status) =>
    DEADLINE_STATUS_META[status] ?? {
        label: "Source status unavailable",
        tone: "awaiting",
    };

export const getAllVenues = () =>
    [...(DEADLINE_DATA.venues ?? [])]
        .map((venue) => ({
            ...venue,
            milestones: [...(venue.milestones ?? [])].sort(
                (left, right) =>
                    Date.parse(left.deadline_at) - Date.parse(right.deadline_at),
            ),
        }))
        .sort((left, right) => {
            const leftHasMilestones = left.milestones.length > 0;
            const rightHasMilestones = right.milestones.length > 0;
            if (leftHasMilestones !== rightHasMilestones) {
                return leftHasMilestones ? -1 : 1;
            }
            return left.name.localeCompare(right.name);
        });

export const getDefaultMilestoneId = (venue, now = new Date()) => {
    const nextMilestone = venue.milestones?.find((milestone) => {
        const deadline = asDate(milestone.deadline_at);
        return deadline && deadline > now;
    });

    return nextMilestone?.id ?? venue.milestones?.[0]?.id ?? null;
};

export const formatDeadlineInDisplayTimezone = (deadlineAt) => {
    const date = asDate(deadlineAt);
    if (!date) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: DEADLINE_DISPLAY_TIMEZONE,
    }).format(date);
};

export const formatSourceCheckedAt = (checkedAt) => {
    const date = asDate(checkedAt);
    if (!date) {
        return "Not checked yet";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: DEADLINE_DISPLAY_TIMEZONE,
    }).format(date);
};

export const getCountdownLabel = (deadlineAt, now) => {
    const deadline = asDate(deadlineAt);
    if (!deadline || !now) {
        return "Calculating…";
    }

    const remainingMs = deadline.getTime() - now.getTime();
    if (remainingMs <= 0) {
        return "Closed";
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
};
