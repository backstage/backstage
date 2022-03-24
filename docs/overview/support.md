---
id: support
title: Support and community
description: Support and Community Details and Links
---

- [Discord chatroom](https://discord.gg/MUpMjP2) - Get support or discuss the
  project.
- [Good First Issues](https://github.com/backstage/backstage/contribute) - Start
  here if you want to contribute.
- [RFCs](https://github.com/backstage/backstage/labels/rfc) - Help shape the
  technical direction by reviewing _Request for Comments_ issues.
- [FAQ](../FAQ.md) - Frequently Asked Questions.
- [Code of Conduct](https://github.com/backstage/backstage/blob/master/CODE_OF_CONDUCT.md) -
  This is how we roll.
- [Blog](https://backstage.io/blog/) - Announcements and updates.
- [Newsletter](https://mailchi.mp/spotify/backstage-community) - Subscribe to
  our email newsletter.
- Give us a star ⭐️ - If you are using Backstage or think it is an interesting
  project, we would love a star! ❤️

## Community Hub

Check out the Backstage.io [Backstage Community Hub](https://backstage.io/community) for the Community Sessions, recordings, and community resources.

### Adding a recording to the meetup page

To add a new recording to the [meetup page](https://backstage.io/on-demand)
create a file in
[`microsite/data/on-demand`](https://github.com/backstage/backstage/tree/master/microsite/data/on-demand)
with your recording's information. Filenames should be in the format `yyyymmdd-xx.yaml`. The page will sort using the filename. Example file content:

```yaml
---
title: # name of the meetup
date: February 23, 2022 # date, format: Month day, year.
category: Meetup # Can be Event, Meetup, Webinar
description: # description, summary
youtubeUrl: # Url to youtube video
youtubeImgUrl: # Url to the preview image, for Youtube this is the format: https://i1.ytimg.com/vi/<YOUTUBE_ID>/mqdefault.jpg
```

### Adding an upcoming meetup to the meetup page

To add an upcoming meetup to the [meetup page](https://backstage.io/on-demand)
create a file in
[`microsite/data/on-demand`](https://github.com/backstage/backstage/tree/master/microsite/data/on-demand)
with your meetup's information. Filenames should be in the format `yyyymmdd-xx.yaml`, the page will sort using the filename. Example file content:

```yaml
---
title: # name of the meetup
date: February 23, 2022 # date, format: Month day, year.
category: Upcoming # Should be "Upcoming"
description: # description, summary
youtubeUrl: # Url to youtube video
youtubeImgUrl: # Url to the preview image, for Youtube this is the format: https://i1.ytimg.com/vi/<YOUTUBE_ID>/mqdefault.jpg
rsvpUrl: # Link to registration, calendar item, etc
eventUrl: # Link to event landing page
```

After the meetup is done, and the recording is ready you can change it to a meetup recording.
