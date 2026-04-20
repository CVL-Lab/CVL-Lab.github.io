import "./Publication.css";
import PublicationCard from "./Publication.Card";
import { useEffect, useMemo, useState } from "react";
import PublicationButton from "./Publication.Button";
import {
    aggregatePublications,
    getPublicationCategories,
} from "./home/homeData";
import { useLocation } from "react-router-dom";
import { RESEARCH_CATEGORY_LABELS } from "../../utils/researchData";

const areaCategory = getPublicationCategories();
const publications = aggregatePublications();
const SEARCH_SCOPES = [
    { key: "title", label: "Title" },
    { key: "title-authors", label: "Title + Authors" },
    { key: "title-authors-venue", label: "Title + Authors + Venue" },
];
const SEARCH_PLACEHOLDER_BY_SCOPE = {
    title: "Search by title",
    "title-authors": "Search by title or authors",
    "title-authors-venue": "Search by title, authors, or venue",
};

function Publication() {
    const location = useLocation();
    const [selectedArea, setSelectedArea] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchScope, setSearchScope] = useState("title");

    const handleSelectedArea = (area) => {
        setSelectedArea(area);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryFromParams = params.get("q")?.trim() ?? "";
        const scopeFromParams = params.get("scope")?.trim() ?? "";
        const areaFromParams = params.get("area")?.trim() ?? "";

        const hasValidScope = SEARCH_SCOPES.some(
            (item) => item.key === scopeFromParams,
        );
        const hasValidArea = areaCategory.includes(areaFromParams);

        setSearchQuery(queryFromParams);
        setSearchScope(
            hasValidScope
                ? scopeFromParams
                : queryFromParams
                  ? "title-authors"
                  : "title",
        );
        setSelectedArea(hasValidArea ? areaFromParams : "all");
    }, [location.search]);

    const filteredPublications = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return publications.filter((publicationItem) => {
            const areaMatch =
                selectedArea === "all" ||
                selectedArea === publicationItem.category;

            if (!areaMatch) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            const searchParts = [publicationItem.title, publicationItem.id];

            if (
                searchScope === "title-authors" ||
                searchScope === "title-authors-venue"
            ) {
                searchParts.push(publicationItem.research_meta.author);
            }

            if (searchScope === "title-authors-venue") {
                searchParts.push(publicationItem.research_meta.published_place);
                searchParts.push(
                    ...(publicationItem.research_meta.keywords ?? []),
                );
            }

            const searchTarget = searchParts.join(" ").toLowerCase();

            return searchTarget.includes(normalizedQuery);
        });
    }, [searchQuery, selectedArea, searchScope]);

    return (
        <div data-reveal data-reveal-load-delay="60" className="publication">
            <div
                data-reveal
                className="tab-header page-head page-head--publication">
                <h1>Publication</h1>
                <p className="page-head__summary">
                    Search and filter the publication archive by research area,
                    title, authors, and venue.
                </p>
            </div>

            <div
                data-reveal
                className="publication__controls page-panel page-panel--compact page-panel--section-start page-controls">
                <div className="publication__controls-intro page-controls__intro">
                    <h2 id="publication-controls-title">Filter and search</h2>
                    <p>
                        Combine category filters and text search to quickly find
                        relevant publications.
                    </p>
                </div>
                <div className="publication__controls-grid page-controls__grid">
                    <section className="publication__controls-group page-controls__group">
                        <div className="publication__controls-head">
                            <p className="publication__controls-label page-controls__label">
                                Filter by research area
                            </p>
                            <p className="publication__controls-caption page-controls__caption">
                                Categorical filtering narrows the archive by
                                major research theme.
                            </p>
                        </div>
                        <div
                            className="publication__filter page-controls__actions"
                            role="group"
                            aria-label="Filter publications by area">
                            {areaCategory.map((area, i) => (
                                <PublicationButton
                                    key={area + i}
                                    areaKey={area}
                                    isSelected={selectedArea === area}
                                    onSelect={() => handleSelectedArea(area)}>
                                    {RESEARCH_CATEGORY_LABELS[area] ||
                                        area.charAt(0).toUpperCase() +
                                            area.slice(1)}
                                </PublicationButton>
                            ))}
                        </div>
                    </section>

                    <section className="publication__controls-group page-controls__group">
                        <div className="publication__controls-head">
                            <label
                                className="publication__search-label page-controls__label"
                                htmlFor="publication-search">
                                Search publications
                            </label>
                            <p className="publication__controls-caption page-controls__caption">
                                Text search runs on title, authors, and venue
                                based on the selected scope.
                            </p>
                        </div>
                        <div className="publication__search-layout">
                            <div className="publication__search-input-wrap">
                                <input
                                    id="publication-search"
                                    type="search"
                                    className="publication__search-input"
                                    placeholder={
                                        SEARCH_PLACEHOLDER_BY_SCOPE[
                                            searchScope
                                        ] || "Search publications"
                                    }
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                />
                            </div>
                            <div className="publication__scope-wrap">
                                <p className="publication__scope-label page-controls__label">
                                    Search scope
                                </p>
                                <div
                                    className="publication__scope page-controls__actions"
                                    role="group"
                                    aria-label="Publication search scope">
                                    {SEARCH_SCOPES.map((scope) => (
                                        <button
                                            key={scope.key}
                                            type="button"
                                            className={`publication__scope-btn btn btn--secondary btn--sm interactive-button ${searchScope === scope.key ? "is-active" : ""}`}
                                            onClick={() =>
                                                setSearchScope(scope.key)
                                            }
                                            aria-pressed={
                                                searchScope === scope.key
                                            }>
                                            {scope.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <section
                data-reveal
                className="publication__archive page-panel"
                aria-labelledby="publication-archive-title">
                <div className="publication__section-head">
                    <div>
                        <h2 id="publication-archive-title">
                            Publication Archive
                        </h2>
                        <p>
                            {filteredPublications.length} result
                            {filteredPublications.length === 1 ? "" : "s"} in
                            the current view
                        </p>
                    </div>
                </div>
                <div className="publication__list">
                    {filteredPublications.map((tpub, index) => (
                        <PublicationCard
                            key={`${tpub.key}-${index}`}
                            category={tpub.category}
                            meta={tpub.research_meta}
                            title={tpub.title}
                            revealDelay={`${Math.min(index, 5) * 60}ms`}
                            revealLoadDelay={`${120 + Math.min(index, 5) * 60}`}
                        />
                    ))}
                    {filteredPublications.length === 0 && (
                        <p className="publication__empty">
                            No publications match your selected category and
                            search scope.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Publication;
