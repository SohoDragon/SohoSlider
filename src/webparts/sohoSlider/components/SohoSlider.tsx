import * as React from 'react';
import ISohoSliderProps from './ISohoSliderProps';
import ISohoSliderState from "./ISohoSliderState";
import ISohoSliderSlide from "./ISohoSliderSlide";
import Slider from "react-slick";
import * as FieldNames from "./FieldNames";
import * as Util from "@pnp/common";
import { Item, sp } from "@pnp/sp";
import * as moment from "moment";

require("./SohoSlider.scss");

export default class SohoSlider extends React.Component<ISohoSliderProps, ISohoSliderState> {
  constructor(prop: ISohoSliderProps) {
    super(prop);
    this.state = {
      slides: []
    };
  }

  public componentDidMount(): void {
    this.getItems();
  }

  private async getItems(): Promise<void> {
    const items = await this.getItemsWithImageField(this.props.listname, [FieldNames.IdFieldName, FieldNames.TitleFieldName, FieldNames.ImageRotatorLinkFieldName, FieldNames.ImageRotatorNewWindowFieldName, FieldNames.ImageRotatorHorizontalTextPositionFieldName, FieldNames.ImageRotatorVerticalTextPositionFieldName, FieldNames.ImageRotatorEndDateFieldName]);
    this.parseItems(items);
  }

  private parseItems(items): void {
    let slides: ISohoSliderSlide[] = [];
    items.forEach((item) => {
      let sliderSlide: ISohoSliderSlide = {
        id: item[FieldNames.IdFieldName],
        text: item[FieldNames.TitleFieldName],
        imageUrl: this.getImageFromField(item[FieldNames.ImageRotatorImageFieldName]),
        navigationUrl: item[FieldNames.ImageRotatorLinkFieldName],
        newWindow: item[FieldNames.ImageRotatorNewWindowFieldName],
        textHorizontalPosition: item[FieldNames.ImageRotatorHorizontalTextPositionFieldName] ? item[FieldNames.ImageRotatorHorizontalTextPositionFieldName].toLowerCase() : "",
        textVerticalPosition: item[FieldNames.ImageRotatorVerticalTextPositionFieldName] ? item[FieldNames.ImageRotatorVerticalTextPositionFieldName].toLowerCase() : ""
      };
      slides.push(sliderSlide);
    });
    this.setState({ slides });
  }

  private getItemsWithImageField(listTitle: string, selects: string[]) {
    return new Promise((resolve, reject) => {

      // this array will be all the results once we are done
      const itemsCollector = [];

      // build some query pieces to use
      let today = moment();
      let filter = `((${FieldNames.ImageRotatorEndDateFieldName} ge datetime'${today.format("YYYY-MM-DD")}T00:00:00Z') or (${FieldNames.ImageRotatorEndDateFieldName} eq null)) and ((${FieldNames.ImageRotatorStartDateFieldName} le datetime'${today.format("YYYY-MM-DD")}T00:00:00Z') or (${FieldNames.ImageRotatorStartDateFieldName} eq null))`;
      const items = sp.web.lists.getByTitle(listTitle).items;
      const query = items.select.apply(items, selects).filter(filter).orderBy(FieldNames.ImageRotatorSequenceFieldName).top(this.props.itemCount);

      // get the initial list of items
      query.get().then((results) => {

        // we will use a batch to save as much as possible on traffic
        const batch = sp.web.createBatch();

        // now we need to add all the requests to the batch
        // for each item we need to then make a seperate call to get the FieldValuesAsHtml
        for (let i = 0; i < results.length; i++) {

          // use the Item class to build our request for each item, appending FieldValuesAsHtml to url
          const htmlValues = new Item(items.getById(results[i].Id), "FieldValuesAsHtml");

          htmlValues.select("ImageRotatorImage").inBatch(batch).get().then(htmlValue => {

            // extend our item and push into the result set
            itemsCollector.push(Util.extend(results[i], {
              ImageRotatorImage: htmlValue.ImageRotatorImage,
            }));
          });
        }

        // execute the batch
        batch.execute().then(_ => {

          // use the behavior that all contained promises resolve first to ensure itemsCollector is populated
          resolve(itemsCollector);
        });

      }).catch(e => {

        reject(e);
      });
    });
  }

  private getImageFromField(t: string): string {
    var simplePattern = /src\s*=\s*("|'|&quot;)\s*(.+?)("|'|&quot;)/ig;
    var regex = /src\s*=\s*("|'|&quot;(<a\s*href\s*=\s*('|")?)?)\s*(.+?)("|'|&quot;)/ig;
    var matches = regex.exec(t);
    if (!matches) return null;
    if (matches && matches.length == 6) {
      return matches[4];
    }
    if (matches && matches.length == 4) {
      return matches[2];
    }
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
                      >
                        <img src={slide.imageUrl} />
                      </span>
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
                      >
                        <img src={slide.imageUrl} />
                      </span>
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
