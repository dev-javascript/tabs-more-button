
export type ITabsMoreButton = {
    resize: (selectedTabIndex: number, direction?: "ltr" | "rtl", isVertical?: boolean) => Array<{ el: HTMLElement, index: Number }>;
};
declare class tabsMoreButton implements ITabsMoreButton {
    constructor(options: {
        containerDisplay?: string;
        tabDisplay?: string;
        buttonElement: HTMLElement;
        containerElement: HTMLElement;
        tablistElement: HTMLElement;
    });
    public resize(selectedTabIndex: number, direction?: "ltr" | "rtl", isVertical?: boolean): Array<{ el: HTMLElement, index: Number }>;
}
export default tabsMoreButton;