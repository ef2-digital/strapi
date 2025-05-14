#!/bin/bash

cd "$(dirname "$0")/.."

echo "🚀 Publishing all @ef2 packages..."

# Core
cd packages/core/strapi
npm publish --access=restricted
cd ../../../..

# Plugins
cd packages/core/plugin-users-permissions
npm publish --access=restricted
cd ../../../..

cd packages/providers/email-mailgun
npm publish --access=restricted
cd ../../../..

cd packages/providers/upload-aws-s3
npm publish --access=restricted
cd ../../../..

echo "✅ Selected packages published successfully!"