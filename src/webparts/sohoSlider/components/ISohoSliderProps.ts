import { WebPartContext } from "@microsoft/sp-webpart-base";

export default interface ISohoSliderProps {
  description: string;
  context: WebPartContext;
  interval: string;
  itemCount: string;
  listname: string;
}
