import { getPublicationFigure } from "../../assets/images/publications/publication_figure_index";

export default function PublicationFigure({
    publicationId,
    className,
    sizes,
}) {
    const figure = getPublicationFigure(publicationId);

    return (
        <figure
            className={`${className} publication-figure`}
            data-publication-figure={figure?.figureLabel ?? undefined}>
            {figure ? (
                <img
                    src={figure.image}
                    alt={figure.alt}
                    loading="lazy"
                    decoding="async"
                    sizes={sizes}
                />
            ) : (
                <div className="publication-figure__placeholder">
                    Figure unavailable
                </div>
            )}
        </figure>
    );
}
