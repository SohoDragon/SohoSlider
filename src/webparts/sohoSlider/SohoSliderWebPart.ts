import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SohoSliderWebPartStrings';
import SohoSlider from './components/SohoSlider';
import ISohoSliderProps from './components/ISohoSliderProps';
import { SPComponentLoader } from "@microsoft/sp-loader";
import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp";
export default class SohoSliderWebPart extends BaseClientSideWebPart<ISohoSliderProps> {

  public onInit(): Promise<void> {
    SPComponentLoader.loadCss(
      "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    );
    SPComponentLoader.loadCss(
      "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    );
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<ISohoSliderProps > = React.createElement(
      SohoSlider,
      {
        description: this.properties.description,
        context: this.context,
        interval: this.properties.interval,
        itemCount: this.properties.itemCount,
        listname: this.properties.listname
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("listname", {
                  label: "List Name",
                  multiline: false,
                  resizable: false
                }),
                PropertyPaneTextField("interval", {
                  label: "Slider Delay (Milliseconds) (Default: 8s)",
                  multiline: false,
                  resizable: false
                }),
                PropertyPaneTextField("itemCount", {
                  label: "Number of items to show (Default: 2000)",
                  multiline: false,
                  resizable: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
