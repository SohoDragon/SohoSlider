import * as React from 'react';
import ISohoSliderProps from './ISohoSliderProps';
import ISohoSliderState from "./ISohoSliderState";
import ISohoSliderSlide from "./ISohoSliderSlide";
import Slider from "react-slick";
import * as FieldNames from "./FieldNames";

require("sp-init");
require("microsoft-ajax");
require("sp-runtime");
require("sharepoint");

require("./SohoSlider.scss");

export default class SohoSlider extends React.Component<ISohoSliderProps, ISohoSliderState> {
  constructor(prop: ISohoSliderProps) {
    super(prop);
    this.state = {
      slides: []
    };
  }

  public componentDidMount(): void {
    this.fillData();
  }

  private _getItems(
    listName: string,
    query: string,
    pageInfo: string
  ): Promise<SP.ListItemCollection> {
    let context: any = new SP.ClientContext(
      this.props.context.pageContext.web.absoluteUrl
    );
    let web: SP.Web = context.get_web();
    let list: SP.List = web.get_lists().getByTitle(listName);

    let camlQuery: any = new SP.CamlQuery();
    camlQuery.set_viewXml(query);

    if (pageInfo && pageInfo.length > 0) {
      let position: any = new SP.ListItemCollectionPosition();
      position.set_pagingInfo(pageInfo);
      camlQuery.set_listItemCollectionPosition(position);
    }

    let allItems: SP.ListItemCollection = list.getItems(camlQuery);
    context.load(allItems);

    return new Promise<SP.ListItemCollection>((resolve, reject) => {
      context.executeQueryAsync(
        (sender: any, args: SP.ClientRequestSucceededEventArgs): void => {
          resolve(allItems);
        },
        (sender: any, args: SP.ClientRequestFailedEventArgs): void => {
          reject(args.get_message());
        }
      );
    });
  }

  private fillData(): void {
    if (!this.props.listname || this.props.listname === "") {
      alert("Please configure webpart properties and reload the page.");
      return;
    }

    let query: string = `<View>
    <Query>
      <Where>
        <And>
          <Or>
            <Geq>
              <FieldRef Name='${FieldNames.ImageRotatorEndDateFieldName}'/>
                <Value Type="DateTime">
                  <Today/>
                </Value>
            </Geq>
            <IsNull>
              <FieldRef Name='${FieldNames.ImageRotatorEndDateFieldName}' />
            </IsNull>
          </Or>
          <Or>
            <Leq>
              <FieldRef Name='${FieldNames.ImageRotatorStartDateFieldName}'/>
                <Value Type="DateTime">
                  <Today/>
                </Value>
            </Leq>
            <IsNull>
              <FieldRef Name='${FieldNames.ImageRotatorStartDateFieldName}' />
            </IsNull>
          </Or>
        </And>
      </Where>
      <OrderBy>
        <FieldRef Name='${FieldNames.ImageRotatorSequenceFieldName}' />
      </OrderBy>
    </Query>
    <RowLimit Paged="False">${this.props.itemCount}</RowLimit>
    <ViewFields>
      <FieldRef Name='${FieldNames.IdFieldName}'/>
      <FieldRef Name='${FieldNames.TitleFieldName}'/>
      <FieldRef Name='${FieldNames.ImageRotatorLinkFieldName}'/>
      <FieldRef Name='${FieldNames.ImageRotatorNewWindowFieldName}'/>
      <FieldRef Name='${FieldNames.ImageRotatorImageFieldName}'/>
      <FieldRef Name='${
        FieldNames.ImageRotatorHorizontalTextPositionFieldName
      }'/>
      <FieldRef Name='${FieldNames.ImageRotatorVerticalTextPositionFieldName}'/>
    </ViewFields>
  </View>`;

    // tslint:disable-next-line:no-empty
    this._getItems(this.props.listname, query, "").then(results => {
      let slides: ISohoSliderSlide[] = [];

      const listEnumerator: IEnumerator<SP.ListItem> = results.getEnumerator();
      while (listEnumerator.moveNext()) {
        let currentItem: SP.ListItem = listEnumerator.get_current();
        let sliderSlide: ISohoSliderSlide = {
          id: currentItem.get_fieldValues()[FieldNames.IdFieldName],
          text: currentItem.get_fieldValues()[FieldNames.TitleFieldName],
          imageUrl: currentItem.get_fieldValues()[
            FieldNames.ImageRotatorImageFieldName
          ],
          navigationUrl: currentItem.get_fieldValues()[
            FieldNames.ImageRotatorLinkFieldName
          ],
          newWindow: currentItem.get_fieldValues()[
            FieldNames.ImageRotatorNewWindowFieldName
          ],
          textHorizontalPosition: currentItem.get_fieldValues()[
            FieldNames.ImageRotatorHorizontalTextPositionFieldName
          ]
            ? currentItem
                .get_fieldValues()
                [
                  FieldNames.ImageRotatorHorizontalTextPositionFieldName
                ].toLowerCase()
            : "",
          textVerticalPosition: currentItem.get_fieldValues()[
            FieldNames.ImageRotatorVerticalTextPositionFieldName
          ]
            ? currentItem
                .get_fieldValues()
                [
                  FieldNames.ImageRotatorVerticalTextPositionFieldName
                ].toLowerCase()
            : ""
        };
        slides.push(sliderSlide);
      }

      this.setState(state => {
        state.slides = slides;
        return state;
      });
    });
  }

  public render(): React.ReactElement<ISohoSliderProps> {
    let settings: any = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: this.props.interval
        ? parseInt(this.props.interval, 10)
        : 8000,
      cssEase: "linear"
    };

    return (
      <div>
        <Slider id="slider" {...settings}>
          {this.state.slides.map(slide => {
            return (
              <div>
                {/* with link */
                slide.navigationUrl && (
                  <a
                    className="slider-item"
                    href={slide.navigationUrl}
                    target={slide.newWindow ? "_blank" : "_self"}
                  >
                    <span
                      className="slider-image"
                      dangerouslySetInnerHTML={{
                        __html: slide.imageUrl
                      }}
                    />
                    <div
                      className={`text-container ${
                        slide.textHorizontalPosition
                      } ${slide.textVerticalPosition}`}
                    >
                      <div className="text">{slide.text}</div>
                    </div>
                  </a>
                )}
                {/* without link */
                !slide.navigationUrl && (
                  <span className="slider-item">
                    <span
                      className="slider-image"
                      dangerouslySetInnerHTML={{
                        __html: slide.imageUrl
                      }}
                    />
                    <div
                      className={`text-container ${
                        slide.textHorizontalPosition
                      } ${slide.textVerticalPosition}`}
                    >
                      <div className="text">{slide.text}</div>
                    </div>
                  </span>
                )}
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}
