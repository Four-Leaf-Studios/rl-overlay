import React from "react";
type CustomHtmlComponentProps = {
    id: string;
    html: string;
    css?: string;
    className?: string;
};
/**
 * Renders sanitized custom HTML with optional scoped CSS.
 * Scripts and inline event handlers are stripped before rendering.
 */
export declare const CustomHtmlComponent: React.NamedExoticComponent<CustomHtmlComponentProps>;
export default CustomHtmlComponent;
