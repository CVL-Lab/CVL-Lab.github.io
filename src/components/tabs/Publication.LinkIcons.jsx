import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAtom,
    faDiagramProject,
    faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import "./Publication.LinkIcons.css";

const LINK_ITEMS = [
    { key: "pdf", label: "PDF", icon: faFilePdf, metaKey: "pdf_link" },
    { key: "arxiv", label: "arXiv", icon: faAtom, metaKey: "arxiv_link" },
    { key: "github", label: "GitHub", icon: faGithub, metaKey: "github_link" },
    {
        key: "project",
        label: "Project Page",
        icon: faDiagramProject,
        metaKey: "project_link",
    },
];

const normalizeText = (value) =>
    typeof value === "string" ? value.trim() : "";

const isValidHttpUrl = (url) => {
    if (!url) {
        return false;
    }

    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
};

export const getPublicationPrimaryLink = (meta = {}) => {
    const orderedKeys = [
        "pdf_link",
        "arxiv_link",
        "project_link",
        "github_link",
        "paper_link",
        "source_code_link",
    ];

    for (const key of orderedKeys) {
        const value = normalizeText(meta?.[key]);
        if (isValidHttpUrl(value)) {
            return value;
        }
    }

    return "";
};

export default function PublicationLinkIcons({ meta = {}, className = "" }) {
    const rootClassName = `publication-link-icons ${className}`.trim();

    return (
        <div className={rootClassName} aria-label="Publication links">
            {LINK_ITEMS.map((item) => {
                const rawUrl = normalizeText(meta?.[item.metaKey]);
                const isActive = isValidHttpUrl(rawUrl);

                if (!isActive) {
                    return (
                        <span
                            key={item.key}
                            className="publication-link-icons__item is-disabled"
                            title={`${item.label} unavailable`}
                            aria-label={`${item.label} unavailable`}>
                            <FontAwesomeIcon
                                icon={item.icon}
                                aria-hidden="true"
                            />
                        </span>
                    );
                }

                return (
                    <a
                        key={item.key}
                        href={rawUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="publication-link-icons__item is-active"
                        title={item.label}
                        aria-label={`Open ${item.label}`}>
                        <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </a>
                );
            })}
        </div>
    );
}
