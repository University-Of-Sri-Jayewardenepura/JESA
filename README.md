`This is the first version of the website made back in 2023 and taken from https://github.com/th3-s7r4ng3r/JESA-2023-App`

![JESA 2023 Logo](https://github.com/th3-s7r4ng3r/JESA-2023-App/blob/main/public/images/jesa23-logo.png)

# JESA 2023

## What is JESA?

JESA, also known as J’pura Employability Skills Awards, is the grandest stage for the celebration of achievements of young talents with 13 outstanding awards reserved for undergraduates of the University of Sri Jayewardenepura. Organized by the Career Skills Development Society of the University of Sri Jayewardenepura under the Career Guidance unit.

In this application, we are trying to provide information about awards, partnerships, registrations, and the legacy of previous years. This is an effort to encourage industry leading companies to join us with JESA 2023 to branch out to the grandest stage of recognition. Within this application, we have implemented an attendance system to track the attendance of the participants of JESA 2023 to automate the manual process. (See the JESA-2023-Backend repository for more information)

Live preview of the app @ [www.jesa.lk](https://www.jesa.lk).

## Getting Started with JESA '23 App

To get started, run the following commands:

### `npm install`

- Runs the above command in the app directory
- Install the required dependencies.

### `npm run dev`

- Runs the app in development mode.
- Open [http://localhost:5173](http://localhost:5173) to view it in
  your browser.
- The page will reload when you make changes.

### `npm run build`

- Builds the app for production to the `build` folder.
  It correctly bundles React in production mode and optimizes the build for the best performance.

### Important!

It is recommended to use the desktop to view the app as it provides more visuals. (Though the app is optimized for both smaller and larger screens)

## For Future Develops :)

A little documentation for future developers as a headstart to keep the project running.

- All the required dependencies are in the `package.json` and the react components are laid out in the `src\components` directory. Styling for those components is in the `src\css` directory.
- There's no backend configured for the app. All the data used within the app are stored in the `public\data` directory as JSON files.

**When editing the JSON files, keep in mind the following points if you are just editing the data without changing the codes in the components.**

- Keep the BESA award at `"id":"7"` and each faculty BESA award after `"id":"7"` in the `award.json` file to avoid displaying awards incorrectly.
- Keep the Best Inventor award at `"id":"4"` in the `award.json` file.
- New awards can be added at the end of the `award.json` file. The order of displaying the awards can be changed by moving up or down the entries. _(Refer above two points before making any changes)_
- When adding a new BESA award, just copy the last BESA award and add it to the end with the new `id`. And change the `"description"` to the faculty name. Then update the image links for each partner.
- If there's any new partners in the Other Partners section, just add them according to the order you want in the `"other-partners.json"` file.
- To add a new Hall of Fame entry, append it to the top of the `hall-of-fame.json` and increment the `id` of the below entries. _(Keeping the `"image"` field empty will skip the entry from displaying. But it will show in the faculty tags area)_
- The order of entries in the `carousel.json` is the order of displaying the images and can be edited as needed. (Images for wider screen sizes are 1600x900 and for smaller screen sizes are 800x900. Rename the files according to the files in the directory)

**Something missing?**
Send me a message and I'll get back to you :)
