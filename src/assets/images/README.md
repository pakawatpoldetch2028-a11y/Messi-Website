# Photographs and images

Every image on the site is referenced from a content file by its path inside
this folder. For example, a file saved as

    src/assets/images/portraits/messi-portrait.jpg

is referenced in `src/content/home.yaml` as

    portrait:
      src: portraits/messi-portrait.jpg
      alt: Pakawat (Messi) Poldetch, smiling, in a white school polo shirt.
      position: 50% 30%

Images are optimised at build time (resized, converted to AVIF/WebP), so you
can add a full-resolution photograph; keep originals under about 4000 px on
the long side and under 5 MB so the build stays quick.

## Folders

| Folder          | What goes here                                              |
| --------------- | ----------------------------------------------------------- |
| `portraits/`    | Portraits for the home and about pages                      |
| `research/`     | Laboratory and field photographs, figures, posters          |
| `shrimppulse/`  | ShrimpPulse screenshots and field photographs               |
| `telesync/`     | Telesync device and application images                      |
| `neuroscience/` | Neuron visualisations and report previews                   |
| `music/`        | Performance photographs                                     |
| `events/`       | Competition and speaking photographs                        |
| `certificates/` | Scans or photographs of certificates                        |

## Image fields

| Field         | Meaning                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `src`         | Path inside this folder. Leave empty (`''`) to show a placeholder frame.        |
| `alt`         | A short description of what is in the picture, for screen readers and search.  |
| `caption`     | Optional caption shown under the image. Simple Markdown works.                  |
| `position`    | Which part of the photo to keep when it is cropped: `50% 50%` is the centre, `50% 20%` keeps the top. |
| `ratio`       | Optional frame shape: `1/1`, `4/5`, `3/4`, `2/3`, `4/3`, `3/2`, `16/9`, `21/9`, `9/16`, `210/297`. |
| `placeholder` | Label shown in the empty frame, e.g. "Laboratory photograph".                   |
| `published`   | `false` hides the slot entirely.                                                |

If `src` points at a file that does not exist, the build prints a warning and
shows the placeholder frame instead of a broken image.
