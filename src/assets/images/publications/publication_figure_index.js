import STYLE_KD_FIGURE_1 from "./figures/style-kd-figure-1.webp";
import SPATIAL_BIAS_FIGURE_1 from "./figures/spatial-bias-figure-1.webp";
import ADNET_FIGURE_2 from "./figures/adnet-figure-2.webp";
import CNN_VIT_MEDICAL_FIGURE_1 from "./figures/cnn-vit-medical-figure-1.webp";
import CT_ASBO_FIGURE_2 from "./figures/ct-asbo-figure-2.webp";
import RAL_FIGURE_2 from "./figures/ral-figure-2.webp";

const PUBLICATION_FIGURES = {
    "biomedical-bapub4-style-kd-class-imbalanced-medical-image": {
        image: STYLE_KD_FIGURE_1,
        figureLabel: "Figure 1",
        alt: "Figure 1 from Style-KD showing source and reference retinal images used to balance the APTOS2019 training set.",
        sourceUrl:
            "https://ars.els-cdn.com/content/image/1-s2.0-S1746809423013617-gr1_lrg.jpg",
    },
    "core-capub0-spatial-bias-for-attention-free-non-local": {
        image: SPATIAL_BIAS_FIGURE_1,
        figureLabel: "Figure 1",
        alt: "Figure 1 from Spatial Bias comparing inference time and top-1 accuracy across non-local network variants.",
        sourceUrl:
            "https://ars.els-cdn.com/content/image/1-s2.0-S0957417423025551-gr1_lrg.jpg",
    },
    "biomedical-bapub2-attentional-decoder-networks-for-chest-x-r": {
        image: ADNET_FIGURE_2,
        figureLabel: "Figure 2",
        alt: "Figure 2 from ADNet comparing a conventional U-Net decoder with the proposed attentional decoder and harmonic magnitude transform.",
        sourceUrl:
            "https://ars.els-cdn.com/content/image/1-s2.0-S0169260724001949-gr2_lrg.jpg",
    },
    "biomedical-bapub3-analyzing-to-discover-origins-of-cnns-and": {
        image: CNN_VIT_MEDICAL_FIGURE_1,
        figureLabel: "Figure 1",
        alt: "Figure 1 from the CNN and ViT analysis paper showing robustness results and corrupted medical image examples.",
        sourceUrl:
            "https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41598-024-58382-3/MediaObjects/41598_2024_58382_Fig1_HTML.png",
    },
    "biomedical-bapub0-deep-learning-using-computed-tomography-to": {
        image: CT_ASBO_FIGURE_2,
        figureLabel: "Figure 2",
        alt: "Figure 2 from the acute small bowel obstruction study showing the proposed CT diagnosis network workflow.",
        sourceUrl:
            "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/72af/10720875/e4ac39b2182c/js9-109-4091-g002.jpg",
    },
    "biomedical-bapub1-robust-asymmetric-loss-for-multi-label-lon": {
        image: RAL_FIGURE_2,
        figureLabel: "Figure 2",
        alt: "Figure 2 from the RAL paper comparing BCE, ASL, and robust asymmetric loss probabilities on multi-label and single-label medical images.",
        sourceUrl:
            "https://openaccess.thecvf.com/content/ICCV2023W/CVAMD/papers/Park_Robust_Asymmetric_Loss_for_Multi-Label_Long-Tailed_Learning_ICCVW_2023_paper.pdf",
    },
};

export const getPublicationFigure = (publicationId = "") =>
    PUBLICATION_FIGURES[publicationId] ?? null;

export default PUBLICATION_FIGURES;
