export const JWT_TOKEN = "JWT_TOKEN";
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

export const SITE_TITLE = "ROCKY DEGUE";
export const SITE_TITLE_FOOTER = "Rocky Dêguê";

export const showTotat = (total: number, range: any[], t: any) =>
  `${range[0]}-${range[1]} ${t("common.to")} ${total} ${t("common.items")}`;