#!/bin/bash

cd "$(dirname "$0")/.."

echo "🛠️  Preparing selected packages only..."

# Define list of packages to update
PACKAGES=(
  "packages/core/strapi"
  "packages/plugins/users-permissions"
  "packages/providers/email-mailgun"
  "packages/providers/upload-aws-s3"
)

NEW_SCOPE="@ef2"
NEW_REPO_URL="https://github.com/ef2-digital/strapi"
NEW_AUTHOR_NAME="EF2 Digital"
NEW_AUTHOR_EMAIL="info@ef2.digital"
NEW_AUTHOR_URL="https://ef2.digital"
NEW_VERSION_SUFFIX="-ef2.1"

for packagePath in "${PACKAGES[@]}"; do
  filename="$packagePath/package.json"
  echo "⚙️  Updating $filename"

  tmpfile=$(mktemp)

  jq '
    def renameDeps(obj): 
      with_entries(
        if .key == "dependencies" or .key == "peerDependencies" then
          .value |= with_entries(
            if .key | startswith("@strapi/") then
              .key |= "@ef2/" + (.key | split("/") | .[1])
            else .
            end
          )
        else .
        end
      );

    .name |= (if startswith("@strapi/") then "'"$NEW_SCOPE"'" + (.[8:] | tostring) else . end) |
    .repository.url? = "'"$NEW_REPO_URL"'" |
    .bugs.url? = "'"$NEW_REPO_URL/issues"'" |
    .author = { name: "'"$NEW_AUTHOR_NAME"'", email: "'"$NEW_AUTHOR_EMAIL"'", url: "'"$NEW_AUTHOR_URL"'" } |
    .license = "MIT" |
    .version |= (. + "'"$NEW_VERSION_SUFFIX"'") |
    renameDeps(.)
  ' "$filename" > "$tmpfile" && mv "$tmpfile" "$filename"
done

echo "✅ Selected packages updated successfully!"
