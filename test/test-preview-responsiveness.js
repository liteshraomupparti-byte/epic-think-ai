// test/test-preview-responsiveness.js
// Validates Mobile, Desktop, and Tablet preview architecture in index.html & Epic Think AI.html

import fs from 'fs';
import assert from 'assert';

console.log('====================================================');
console.log('📱 TESTING MULTI-DEVICE PREVIEW ENGINE INTEGRITY');
console.log('====================================================\n');

const files = ['index.html', 'Epic Think AI.html'];

files.forEach(fileName => {
  console.log(`Checking ${fileName}...`);
  const content = fs.readFileSync(fileName, 'utf8');

  // 1. Check Responsive Chassis CSS
  assert(content.includes('.builder-device-stage'), `${fileName} missing .builder-device-stage`);
  assert(content.includes('.builder-device-frame.desktop'), `${fileName} missing .builder-device-frame.desktop`);
  assert(content.includes('.builder-device-frame.tablet'), `${fileName} missing .builder-device-frame.tablet`);
  assert(content.includes('.builder-device-frame.mobile'), `${fileName} missing .builder-device-frame.mobile`);
  assert(content.includes('.builder-dynamic-island'), `${fileName} missing .builder-dynamic-island`);
  assert(content.includes('.builder-home-indicator'), `${fileName} missing .builder-home-indicator`);
  assert(content.includes('.builder-tablet-camera'), `${fileName} missing .builder-tablet-camera`);
  assert(content.includes('.builder-desktop-chrome'), `${fileName} missing .builder-desktop-chrome`);
  assert(content.includes('.builder-preview-loader'), `${fileName} missing .builder-preview-loader`);
  console.log(`  ✓ Chassis CSS elements verified in ${fileName}`);

  // 2. Check Mobile Media Query Full-Bleed & Body Scroll Lock
  assert(content.includes('body.builder-workspace-open'), `${fileName} missing body.builder-workspace-open`);
  assert(content.includes('#websiteBuilderWorkspace.workspace-active'), `${fileName} missing workspace-active class`);
  assert(content.includes('#websiteBuilderWorkspace.workspace-closing'), `${fileName} missing workspace-closing class`);
  assert(content.includes('.builder-mobile-device-bar'), `${fileName} missing .builder-mobile-device-bar CSS`);
  assert(content.includes('.builder-mobile-tab-bar'), `${fileName} missing .builder-mobile-tab-bar CSS`);
  assert(content.includes('.builder-mobile-fab'), `${fileName} missing .builder-mobile-fab CSS`);
  console.log(`  ✓ Mobile full-bleed and transition CSS verified in ${fileName}`);

  // 3. Check HTML Markup Elements
  assert(content.includes('id="builderMobileDeviceBar"'), `${fileName} missing #builderMobileDeviceBar HTML`);
  assert(content.includes('id="builderMobileDeviceGroup"'), `${fileName} missing #builderMobileDeviceGroup HTML`);
  assert(content.includes('id="builderRotateBtn"'), `${fileName} missing #builderRotateBtn HTML`);
  assert(content.includes('id="builderMobileRotateBtn"'), `${fileName} missing #builderMobileRotateBtn HTML`);
  assert(content.includes('id="builderZoomSelect"'), `${fileName} missing #builderZoomSelect HTML`);
  assert(content.includes('id="builderDynamicIsland"'), `${fileName} missing #builderDynamicIsland HTML`);
  assert(content.includes('id="builderHomeIndicator"'), `${fileName} missing #builderHomeIndicator HTML`);
  assert(content.includes('id="builderTabletCamera"'), `${fileName} missing #builderTabletCamera HTML`);
  assert(content.includes('id="builderDesktopChrome"'), `${fileName} missing #builderDesktopChrome HTML`);
  assert(content.includes('id="builderPreviewLoader"'), `${fileName} missing #builderPreviewLoader HTML`);
  assert(content.includes('id="builderMobileTabBar"'), `${fileName} missing #builderMobileTabBar HTML`);
  assert(content.includes('id="builderMobileFabPrompt"'), `${fileName} missing #builderMobileFabPrompt HTML`);
  assert(content.includes('id="builderBackToChatBtn"'), `${fileName} missing #builderBackToChatBtn HTML`);
  console.log(`  ✓ HTML structure & IDs verified in ${fileName}`);

  // 4. Check WebsiteBuilder JS Controller Methods
  assert(content.includes('orientation:'), `${fileName} missing orientation property`);
  assert(content.includes('zoomScale:'), `${fileName} missing zoomScale property`);
  assert(content.includes('mobileTab:'), `${fileName} missing mobileTab property`);
  assert(content.includes('setDevice('), `${fileName} missing setDevice method`);
  assert(content.includes('toggleOrientation()'), `${fileName} missing toggleOrientation method`);
  assert(content.includes('setZoomScale('), `${fileName} missing setZoomScale method`);
  assert(content.includes('updateViewportScale()'), `${fileName} missing updateViewportScale method`);
  assert(content.includes('setMobileTab('), `${fileName} missing setMobileTab method`);
  assert(content.includes('openWorkspace('), `${fileName} missing openWorkspace method`);
  assert(content.includes('closeWorkspace()'), `${fileName} missing closeWorkspace method`);
  assert(content.includes('refreshPreview()'), `${fileName} missing refreshPreview method`);
  console.log(`  ✓ JS Controller methods verified in ${fileName}\n`);
});

console.log('====================================================');
console.log('🎉 ALL MULTI-DEVICE PREVIEW TESTS PASSED SUCCESSFULLY!');
console.log('====================================================');
