# Between the Pages — Book Club

A four-member book nomination and voting site, built for Netlify. Shared book data is stored in Netlify Blobs, not in individual browsers.

## Deploy

1. Create a GitHub repository containing the files in this folder (not the enclosing folder).
2. In Netlify, choose **Add new project → Import an existing project**, connect the repository, and deploy. The included `netlify.toml` configures build and functions.
3. In Netlify project settings, add environment variables:
   - `CLUB_PASSWORD`: a private shared password for your club. Use a strong, unique password.
   - `CLUB_MEMBERS`: four names separated by commas, e.g. `Alena,Anna,Maria,Julia`.
4. **Redeploy** after adding variables. Share the resulting Netlify site URL and club password privately with the four members.

## Features

- Shared nominations and cover search powered by Open Library (no API key required)
- Five-point votes from -2 to +2, one vote per member per book
- Ranked by average score, then positive votes, then number of voters
- Voting progress and total score visible
- Currently Reading and Finished shelves
- Responsive design

## Important limitations

- Member identity is selected from a list; the shared password protects the whole club, but does not authenticate individuals. Club members can select another person's name. This is a lightweight trust-based app, not a secure individual account system.
- Any member can move or remove books. Deletion is permanent.
- Simultaneous writes may conflict if two people vote at precisely the same moment; refresh and re-vote if needed. For stronger concurrency guarantees use a transactional database.
- Cover images are supplied by Open Library and may be unavailable for some titles.
- Avoid sharing the password publicly.

## Local development

Install Node.js 20+, then run `npm install` and `npx netlify dev`. Configure `CLUB_PASSWORD` and `CLUB_MEMBERS` in your local environment or Netlify CLI before running.
