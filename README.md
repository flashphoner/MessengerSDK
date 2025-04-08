
# Messenger SDK Samples

This project demonstrates the use of the Flashphoner Messenger SDK to enable real-time communication features in a web application.

## Requirements

- **Node.js**: Version **20** or higher is required.  
  Ensure you have the correct version installed before proceeding. You can check your current version with:
  ```sh
  node -v
  ```

## Project Structure

- **`config`**: Configuration files for Webpack and PostCSS.
- **`src`**: Main source code:
    - **`components`**: Reusable UI components.
    - **`events`**: Handlers for Messenger-specific events.
    - **`hooks`**: Custom React hooks for SDK and app logic.
    - **`pages`**: Full-page components for features like direct communication and spaces.
    - **`routes`**: Application routing.
    - **`utils`**: Helper functions and utilities.
    - **`types`**: TypeScript type definitions.
- **`styles`**: Global styles and Tailwind CSS configurations.
- **`public`**: Static assets, including `index.html`.

## Key Scripts

- **`npm start`**: Run the development server.
- **`npm run build`**: Create a production build.
- **`npm run lint`**: Check code quality with ESLint.

## Installation and Setup

1. Ensure **Node.js 20** or higher is installed.

2. Clone the repository:
```sh
git clone <repository-url>
cd messenger-sdk-samples
```

3. Install dependencies:
```sh
npm install -f --registry https://artifactory.flashphoner.com:4873/
```

4. Start the development server:
```sh
npm start
```

## Running in Production

1. **Build the production version**:
```sh
npm run build
```
   This will generate a production-ready build in the `dist` folder.

2. **Serve the production build**:  
   To serve the `dist` folder locally, use the `serve` package:

- First, install `serve` globally (if not already installed):
```sh
npm install -g serve
```
- Then, run the following command to serve the production build:
```sh
serve -s ./dist
```

After running `serve -s ./dist`, you will see links in the terminal where the application is accessible (usually http://localhost:3000).
