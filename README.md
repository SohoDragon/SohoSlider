## soho-slider



1. Go to this URL https://github.com/SohoDragon/SohoSlider/blob/master/dist/soho-slider.sppkg
2. Click on Download. This should save a file called soho-slider.sppkg to your desktop.
3. Add this to your App Catalog. Please follow the steps listed here https://docs.microsoft.com/en-us/sharepoint/use-app-catalog to do so.
4. Add the app to a SharePoint Page
![](http://g.recordit.co/xCU13Lo8ov.gif)
5. Click on the Pencil Icon,to edit the app "Soho Slider".
6. Enter the List Name as "Image Rotator List"
7. Save the Page
8. Go to the Image Rotator List under Site Contents
9. Add a new Item
10. Enter a Title
11. Click on the link "Click here to Insert a picture from SharePoint".
12. Under Selected Image, enter a URL for the Image and click Ok
13. Click Save









### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
