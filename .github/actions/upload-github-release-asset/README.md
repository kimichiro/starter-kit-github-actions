# Upload Asset to GitHub Release

Upload an asset files to GitHub Release
- Expand uri template with variables to a url
- Make a REST API request to upload asset to GitHub Release

## Usage

```yml
- uses: ./.github/actions/expand-uri-template
  with:
    upload-url: https://uploads.github.com/repos/hello/world/releases/1/assets{?name,label}
    filename: hello.txt
    content-type: text/plain
    label: file description
```

## Inputs

- `upload-url` - **required** Uri template for uploading asset to target release (upload_url property from release object)
- `filename` - **required** Filename including its path to upload
- `content-type` - **required** MIME type for asset file
- `label` - Label to be appeared on release
