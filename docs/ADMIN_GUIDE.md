# Admin content-entry guide

Open `/admin`, sign in with an approved email and use the left navigation. Owner can manage users, security-sensitive settings, certification publication, verified testimonials, redirects and retention. Editor can manage ordinary content but cannot grant access or perform Owner-only actions.

## Catalog

1. Upload approved product images in **Media** as public images. Copy the media ID.
2. Create a top-level category or subcategory. For a subcategory, paste its parent category ID.
3. Publish the category.
4. Create the product, select the subcategory ID, paste the primary public image ID and enter only verified fields.
5. Save as Draft, review the public preview data, then Publish. Publishing is blocked if the category or public image is missing.
6. Add multiple requirements through the RFQ basket on the public site to test the buyer journey.

Unknown materials, finishes, sterilization, regulatory status, MOQ and lead-time fields must remain blank. Use **Media → Catalog** to upload a published PDF; `/catalog` always downloads the latest approved public catalog.

### Bulk media upload

1. Open **Media** and choose up to 20 files together.
2. Select the correct kind and visibility for the whole batch.
3. Optionally enter a shared alt-text prefix. The original filename is appended so every image remains distinguishable.
4. The batch is limited to 50 MB total. Images accept JPEG, PNG and WebP; catalogs/datasheets accept PDF only.
5. All files are validated first. If storage or the database fails, uploaded objects from that batch are cleaned up instead of leaving partial records.

## Editorial content

- Blog posts, albums and jobs use Draft, Published, Archived and Trash lifecycle states.
- Expired jobs automatically stop appearing publicly.
- A testimonial cannot publish until permission is **Approved** and verification is **Verified**.
- A certification cannot publish until evidence media is attached and the Owner marks it verified.
- ISO 13485 and CE are seeded as private unverified Draft references only.

### Bulk blog import

1. Open **Blog / news** and download the CSV template.
2. Keep the required `title` and `body` columns. Optional columns are `slug`, `excerpt`, `sources`, `hero_media_id`, `author_id`, and `category_id`.
3. Upload up to 100 articles in one CSV (maximum 2 MB).
4. Every imported article is deliberately saved as **Draft**. Review facts, sources, images and technical meaning before publishing.
5. CSV slugs must be unique and must not already exist. Provided author, category and hero-image IDs are validated before the batch is inserted.

## Enquiries

RFQs, contacts and applications show reference, status and assignee. Change status, assign a team member and add an internal note. Export only when operationally necessary; exported CSV contains personal data and must follow the retention policy.

## Safe operating rules

- Never send or store a Gmail password in the project.
- Never publish invented products, reviews, certifications, clients, countries, claims or jobs.
- Trash is a soft delete. Preserve audit history.
- Upload only PDF, JPEG, PNG or WebP files that you are authorised to publish.
- Use meaningful alt text for informative images and leave decorative alt text blank.
