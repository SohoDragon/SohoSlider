## soho-slider

This is where you include your WebPart documentation.


1. Go to this URL https://github.com/SohoDragon/SohoSlider/blob/master/dist/soho-slider.sppkg
2. Click on Download. This should save a file called soho-slider.sppkg to your desktop.
3. Go to this URL https://{TENANTNAME}-admin.sharepoint.com/_layouts/15/online/tenantadminapps.aspx . 
4. Click on App Catalog
5. On the Left Navigation, select "Apps for SharePoint"
6. Drag and drop the file downloaded from Step 2 to this page.

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
