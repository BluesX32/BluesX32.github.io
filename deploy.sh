#!/usr/bin/env bash
set -e

echo "Building..."
npm run build

echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Done. Site will be live at https://BluesX32.github.io in ~1 minute."