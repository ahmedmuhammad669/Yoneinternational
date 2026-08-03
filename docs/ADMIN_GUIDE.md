# Admin content-entry guide

Open `/admin`, sign in with an approved email and use the left navigation. Owner can manage users, security-sensitive settings, certification publication, verified testimonials, redirects and retention. Editor can manage ordinary content but cannot grant access or perform Owner-only actions.

## Catalog

1. In **Media**, select one or several approved product images, choose **Images** and **Public**, then upload. Up to 20 files and 50 MB combined are accepted. Copy the resulting media ID from the list.
2. Create a top-level category or subcategory. For a subcategory, paste its parent category ID.
3. Publish the category.
4. Create the product, select the subcategory ID, paste the primary public image ID and enter only verified fields.
5. Save as Draft, review the public preview data, then Publish. Publishing is blocked if the category or public image is missing.
6. Add multiple requirements through the RFQ basket on the public site to test the buyer journey.

Unknown materials, finishes, sterilization, regulatory status, MOQ and lead-time fields must remain blank. Use **Media → Catalog** to upload a published PDF; `/catalog` always downloads the latest approved public catalog.

## Editorial content

- Blog posts, albums and jobs use Draft, Published, Archived and Trash lifecycle states.
- To add many articles, open **Blog / News**, download the CSV template, complete the `title` and `body` columns, and import up to 100 rows. Every row is created as Draft; review each article before publishing.
- CSV fields containing commas or line breaks must be enclosed in double quotes. Duplicate or existing slugs, unknown IDs and invalid files are rejected without a partial import.
- Expired jobs automatically stop appearing publicly.
- A testimonial cannot publish until permission is **Approved** and verification is **Verified**.
- A certification cannot publish until evidence media is attached and the Owner marks it verified.
- ISO 13485 and CE are seeded as private unverified Draft references only.

## Enquiries

RFQs, contacts and applications show reference, status and assignee. Change status, assign a team member and add an internal note. Export only when operationally necessary; exported CSV contains personal data and must follow the retention policy.

## Safe operating rules

- Never send or store a Gmail password in the project.
- Never publish invented products, reviews, certifications, clients, countries, claims or jobs.
- Trash is a soft delete. Preserve audit history.
- Upload only PDF, JPEG, PNG or WebP files that you are authorised to publish.
- Bulk media uploads go directly to private Supabase Storage with short-lived signed tickets. The server checks actual file signatures, sizes and ownership before adding them to the Media Library.
- Use meaningful alt text for informative images and leave decorative alt text blank.
