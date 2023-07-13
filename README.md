# Quick Weather Report

Marcelo Andrés Mendoza
¡Thank you by stopping by! I am a FullStack MERN developer in training at UDD, Chile.

This webapp is intended to be a lightweight and quick way to view today's forecast for your location in a dashboard format, using chart.js framework to display at glance the projected data without distractions.

For this project, i've used Astro Build, a Node.JS environment characterized by use modularization of components called [Component Islands](https://docs.astro.build/en/getting-started/), and it allows to diminish the size of the whole site loading only the fragments I need in each page.

It also has client side javascript rendering content, replacing DIVs with IP and weather data, using API endpoints from [IPAPI.com](https://ipapi.co/api/#introduction) and [Open Meteo](https://open-meteo.com/en/docs) forecast website. Note that endpoints are only for free use, so it has limited rates.

After adding precise geolocation via user device, i need to show anyway the location name to the user, so i used the API from [Geocode Maps](https://geocode.maps.co/) to reverse geocoding, that is the process to get a human readable address from GPS coordinates.

> 🧑‍🚀 **Technical details?**
> When loading, it ask permission to get precise coordinates from your device's gps or geolocation data. If is not granted, or not available, it tries to get the location via IP. Also, the app stores the obtained location data, so the next time the page loads, search first for that on local storage. You can override this data by just clicking the button 'Update'.

## 👀 View the deployed webapp

Take a look on the [project's deployed website](https://marceloandresmendoza.github.io/weather-report/).

## 🚀 Project Structure

Inside of this project, you'll see the following folders and files:

``` bash
/
├── docs/ [Output Build, changed from dist for github pages compatibility]
├── src/
│   ├── pages/
│   |   ├── index.astro [Main page]
│   |   ├── developer.astro [Developer info]
│   |   └── locations.astro [Custom locations (Work in progress)]
│   ├── components/ [App reusable components]
│   |   ├── charts/
│   |   └── ...
│   ├── layouts/
│   |   └── MainLayout.astro [Main html container]
│   ├── assets/
│   |   ├── img/
│   |   ├── scripts/
│   |   └── styles/
└── package.json
```

Most of the folders are self explanatory on what they do. The pages uses the MainLayout container, and each page has some local pure css styling, but some classes are located on the style.css file on assets folder.

The script is located on the scripts folder, and is sent to the user as is when loading the site, since [Astro optimizes the site](https://docs.astro.build/en/getting-started/) and disposes most of javascript for a by default Zero JS lightweight experience.

## 🧞 Commands

You can get this project via git clone
``` bash
git clone https://marceloandresmendoza/weather-report
```

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./docs/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
