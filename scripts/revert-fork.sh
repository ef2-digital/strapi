#!/bin/bash

cd "$(dirname "$0")/.."

echo "🛠️  Reverting selected packages back to @strapi scope..."

# Define list of packages to revert
PACKAGES=(
  "packages/core/strapi"
  "packages/plugins/users-permissions"
  "packages/providers/email-mailgun"
  "packages/providers/upload-aws-s3"
)

OLD_SCOPE="@strapi"
ORIGINAL_REPO_URL="https://github.com/strapi/strapi"
ORIGINAL_AUTHOR_NAME="Strapi Solutions SAS"
ORIGINAL_AUTHOR_EMAIL="hi@strapi.io"
ORIGINAL_AUTHOR_URL="https://strapi.io"
REMOVE_VERSION_SUFFIX="-ef2.1"

for packagePath in "${PACKAGES[@]}"; do
  filename="$packagePath/package.json"
  echo "⚙️  Reverting $filename"

  tmpfile=$(mktemp)

  jq '
    def renameDeps(obj): 
      with_entries(
        if .key == "dependencies" or .key == "peerDependencies" then
          .value |= with_entries(
            if .key | startswith("@ef2/") then
              .key |= "@strapi/" + (.key | split("/") | .[1])
            else .
            end
          )
        else .
        end
      );

    .name |= (if startswith("@ef2/") then "'"$OLD_SCOPE"'" + (.[5:] | tostring) else . end) |
    .repository.url? = "'"$ORIGINAL_REPO_URL"'" |
    .bugs.url? = "'"$ORIGINAL_REPO_URL/issues"'" |
    .author = { name: "'"$ORIGINAL_AUTHOR_NAME"'", email: "'"$ORIGINAL_AUTHOR_EMAIL"'", url: "'"$ORIGINAL_AUTHOR_URL"'" } |
    .license = "SEE LICENSE IN LICENSE" |
    .version |= sub("'"$REMOVE_VERSION_SUFFIX"'"; "") |
    renameDeps(.)
  ' "$filename" > "$tmpfile" && mv "$tmpfile" "$filename"
done

echo "✅ Selected packages reverted successfully!"
