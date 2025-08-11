# Internationalization in your application

Internationalization (abbreviated to i18n) is the process of providing UI messages and captions in different human languages to make them easier for readers of those languages to understand.

## Contents

-   [I18n concepts](#i18n-concepts)
-   [Your application support for i18n](#your-application-support-for-i18n)
    - [HTML usage](#html-usage)
    - [TypeScript usage](#typescript-usage)
    - [How to allow user to change current language?](#how-to-allow-user-to-change-current-language)
- [Localization](#localization)
    - [Setting up the configuration in your app](#setting-up-the-configuration-in-your-app)
    - [Localized pipes usage](#localized-pipes-usage)

## I18n concepts

The main idea behind i18n is to avoid adding natural language text directly into the HTML. Instead, UI messages are represented by short strings known as **keys**. Keys are not displayed directly; they are used to look up the actual text in a list of predefined messages. A typical key/message pair might look like the
following:

    "CS_URL_ERROR": "Content Services address doesn't match the URL format"

Separate lists are kept for each language supported by the app, so for German, the same message would be defined as:

    "CS_URL_ERROR": "Content Services-Adresse nicht im richtigen URL-Format"

Note that the key is the same in both cases. As long as the UI only ever refers to the keys then changing languages is a simple matter of changing the look-up list.

## Your application support for i18n

In order to support multiple language first of all you need to create translation files for supported languages. The files should be named according to standard [two-letter language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes), so `en.json` is the look-up list for English, etc. They should be located in `/assets/i18n` folder. An exmaple of `en.json` is shown
below:

```json
{
  "CUSTOM_COMPONENT": {
    "FORM": {
      "TITLE": "Custom form title"
    },
    "LABEL": {
      "NAME_INPUT_LABEL": "Name input label"
    },
      ...
```

The hierarchical structure is referred to in the UI using the familiar "dot" notation (so `CUSTOM_COMPONENT.FORM.TITLE` would be the key for the "Custom form title" string). This is useful for grouping related messages and providing singular and plural versions, among other things.

### HTML usage
The translation library that we're using is [ngx-translate](https://ngx-translate.org/). To use newly added translation keys first of all you need to import the translate pipe in your component:
```ts
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [TranslatePipe]
})
export class HomeComponent implements OnInit {
...
}
```
and next use the translation key in the HTML template like this:
```html
<span>Translated property: {{ 'CUSTOM_COMPONENT.FORM.TITLE' | translate }}</span>
```

Translation messages have also support for _interpolation_ (ie, including another string at a specified position within a message). This is very useful for messages whose content can change at runtime. For example, in `en.json` we could add:
```json
"CUSTOM_COMPONENT": {
  "FORM": {
    "ITEMS_RANGE": "Showing {{ range }} of {{ total }}",
  },
  ...
```

The sections in curly braces are _interpolation variables_ that you supply at runtime. You can specify them by passing an extra parameters to translate pipe:
```html
{{ "CUSTOM_COMPONENT.FORM.ITEMS_RANGE" | translate: { range: "1..10", total: "122"} }}
```

### TypeScript usage
The same result can also be achieved in the TypeScript part of the component by injecting a [Translate Service](https://ngx-translate.org/reference/translate-service-api/). To get translated string you can use `instant` method:
```ts
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class HomeComponent implements OnInit {
  private translate = inject(TranslateService);
  ...
  translatedString = this.translate.instant('CUSTOM_COMPONENT.FORM.TITLE');

  // or with interpolation variables
  translatedString = this.translate.instant('CUSTOM_COMPONENT.FORM.ITEMS_RANGE', { range: '1..10', total: '122'});
}
```

English is used by default but you can easily change the language with the
`use` method:

```ts
ngOnInit() {
  this.translate.use("de");
}
```

Note that an unrecognized key will be returned unchanged as the "translation". If you see strings like "CUSTOM_COMPONENT.FORM.TITLE" displayed in your app then you should check you are using the key correctly.

### How to allow user to change current language?
Simplest way for achieving that would be to use ADF's [Language Menu component](https://github.com/Alfresco/alfresco-ng2-components/blob/master/docs/core/components/login.component.md). Here is how you can simply add it to the application header:
```html
<adf-layout-header>
  ...
    <button mat-icon-button [matMenuTriggerFor]="langMenu">
      <mat-icon>language</mat-icon>
    </button>
    <mat-menu #langMenu="matMenu">
      <adf-language-menu></adf-language-menu>
    </mat-menu>
  ...
</adf-layout-header>
```
it can also be nested into any other existing menu:
```html
<button mat-icon-button class="profile-menu" [matMenuTriggerFor]="profileMenu">
    <mat-icon>more_vert</mat-icon>
</button>
<mat-menu #profileMenu="matMenu">
    <button mat-menu-item>Profile settings</button>
    <button mat-menu-item [matMenuTriggerFor]="langMenu">Languages</button>
    <button mat-menu-item>sign-out</button>
</mat-menu>
<mat-menu #langMenu="matMenu">
    <adf-language-menu></adf-language-menu>
</mat-menu>
```

To provide the list of languages supported by your application modify `app.config.json` file and add new languages into `languages` array, by default it contains `English`:
```json
"languages": [
        {
            "key": "en",
            "label": "English"
        },
        {
            "key": "fr",
            "label": "French"
        },
        {
            "key": "it",
            "label": "Italian"
        }
    ]
```

## Localization
Localization is the process of making something local in character or restricting it to a particular place. 

Dates are not written the same around the world. That is where localizing a date comes in handy. ADF lets you dynamically change the way dates are written in your app so that they can adapt to to a specific region.

### Setting up the configuration in your app

Date values should be localized in your ADF app. By default they are localized to `en-US`, although you can easily change this by adding the localization files provided by Angular.

If you want to use a different locale simply add the locale file for your region in your `app.config.ts`.

```ts
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);
```

You can overwrite the default values of date format and locale by adding these properties to your `app.config.json`:

```json
 "dateValues": {
   "defaultDateFormat": "mediumDate",
   "defaultDateTimeFormat": "MMM d, y, h:mm",
   "defaultLocale": "en-US"
 }
```

| Name | Type | Description |
| ---- | ---- | ----------- |
| defaultDateFormat | string | The format to apply to date values |
| defaultDateTimeFormat | string | The format to apply to date-time values |
| defaultLocale | string | The locale id to apply |


### Localized pipes usage

You can use `localized date` pipe to convert a date to a given format and locale:

```html
{{ date | adfLocalizedDate: format : locale }}
```

or you can use `time ago` pipe to convert a past date into number of days ago:

```html
{{ date | adfTimeAgo }}
```
