# Unused Components

This folder contains components that have been removed from the main website but are preserved for potential future use.

## Globe Section

The globe section (previously section #2 with ID "work") has been removed from the main website. The following files are related to this section:

- `js/creative-lab.js`: The main JavaScript module that handled the globe visualization and interactions.
- `css/globe.css`: The CSS styles for the globe section, including the globe container, preview popups, and related elements.

## How to Restore

If you want to restore the globe section:

1. Copy `js/creative-lab.js` back to the main `js` folder
2. Link the `css/globe.css` file in the HTML or merge its contents back into styles.css
3. Reintegrate the HTML for the globe section in `index.html` between the home and about sections
4. Update the section numbers in the about and contact sections
5. Add back the "WORK" link in the navigation menu
6. Restore the references to the globe section in:
   - js/main.js
   - js/viewport.js
   - js/animations.js
   - js/scroll-animations.js
7. Add back the script tag for creative-lab.js in index.html

## Original Section HTML

The original HTML for the globe section can be found in a previous version of the index.html file. 

## Globe-related CSS Classes

The following CSS classes are related to the globe section and are now stored in `css/globe.css`:

- `.globe-section`
- `.globe-container`
- `#globe-canvas`
- `.globe-overlay`
- `.globe-intro`
- `.globe-tagline`
- `.globe-info`
- `.globe-categories`
- `.preview-popup` and related classes
- `.location-title`
- `.location-description`
- `.category` and `.category-label` 