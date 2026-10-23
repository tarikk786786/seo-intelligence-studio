# Known Limitations and Open Decisions

Keep this file current. Convert each item to a verified decision or closed issue only after evidence exists.

## External dependencies requiring verification

- A real SERP provider and commercial/technical access have not been selected by this documentation pack.
- Keyword volume/CPC data sources, allowed fields, account access and quotas must be verified before display.
- AI/search providers vary in model availability, web search/grounding, citations, geography controls, retention and commercial terms.
- Google integrations require the applicable developer access, OAuth configuration and property/account permissions.
- Billing provider, subscription plans, tax/compliance obligations and production payment flows are not chosen here.
- Email and support systems need a provider or a documented self-hosted alternative.
- Hosting, database, queue, backup, monitoring and alerting services must be selected and costed.
- Chrome Web Store approval is subject to Google's review and cannot be guaranteed.

## Reference document status

Only the Google Drive PDF's accessible preview and introductory extracted content were available during preparation. The complete 31-page PDF has not been fully verified here. See `docs/reference/BLUEPRINT_NOTES.md` and have the implementation agent inspect the complete PDF through an authorized route before claiming full conformance.

## Product and measurement caveats

- SEO and AI-provider outputs change over time and are not guaranteed rankings or universal end-user experiences.
- Daily refresh is a scheduled attempt and is subject to provider limits, account status, queue health and budget.
- Unlimited entitlements require fair-use/infrastructure policy and must not mean unlimited external API expenditure.
- Customer-success functionality supports assignment workflow; a human service is not provided merely by building the software feature.
- The documentation pack is not an implemented or deployed application. Actual code/test/deployment status must be established in the target repository.

## Unresolved implementation choices

- Existing repository and stack, if any.
- Identity/authentication solution.
- Primary SERP data provider.
- Keyword data provider.
- AI/search providers to support first.
- Hosting and worker orchestration.
- Object storage, email, support and billing providers.
- Initial pricing, entitlements and usage budgets.

Resolve these through repository discovery, official source verification and documented technical decisions. Do not fabricate choices or credentials.
