# Data Sources and Metric Provenance

## Rule
A field is displayed as a provider metric only when the provider response actually supplied it and the terms permit its use. Locally calculated metrics must name the formula and input population. Model-based classifications must be labelled as classifications, not objective ground truth.

## Source register

For every implemented source, record:
- Provider and official documentation URL.
- Feature/endpoint and supported fields.
- Authentication and access approval required.
- Region/language/device options actually supported.
- Quotas, rate limits, retention and commercial usage requirements.
- Cost/free tier as verified at implementation time.
- Timestamp of last verification.
- Failure modes and integration tests.

## Data categories

- **Provider reported:** directly returned field with provider attribution.
- **Locally calculated:** formula and source records are documented.
- **Model classified:** classification produced by a named model/version or method; retain evidence needed to audit it subject to provider rules.
- **Estimated:** methodology, uncertainty and limits disclosed; never presented as official volume, CPC or rank.
- **Unavailable:** source does not supply it or is not connected.
- **Stale:** data exceeded its documented freshness window.
- **Failed:** the actual request failed; do not replace the response with random or default values.

## Candidate sources to verify before integration

- Google Search Console API: performance/property data for authorized properties; requires appropriate access and property permissions.
- Google Ads API: keyword planning and historical metrics where the account/developer access permits them; access level and quota restrictions must be verified.
- PageSpeed Insights API and Chrome UX Report: performance fields supported by the applicable API; do not assume lab and real-user data are interchangeable.
- Authorized SERP provider: current result set for supported engine/location/language/device parameters.
- Official AI/search APIs or licensed visibility provider: supported model responses and sources/citations where the API actually returns them.
- Public website page analysis: only allowed public pages, with safe fetch controls and source URL recorded.

These are candidates, not a statement that the project already has access. Use official documentation and account dashboards to verify current contracts, quotas and pricing at the time of implementation.

## SERP reporting

Store exact input query, search location, language, device, provider, response timestamp, response status and returned results. Historical data should not be silently presented as a current rank. Explain that a rank is specific to the captured query/provider/context.

## AI visibility methodology

For an explicitly defined eligibility set:

`mention_rate = successful eligible observations mentioning target brand / successful eligible observations × 100`

For citation frequency, define whether the unit is an observation or a citation and use that same denominator consistently. Distinguish target-domain citations from general web citations and from simple mentions. Prompt or provider coverage must be shown alongside the measure. Failed observations are not successful observations.

Share of voice must define the counted mention unit and selected competitor set. Sentiment is a model classification with supporting excerpt, not an unquestionable fact. Preserve the prompt version, model/provider, date, market settings where supported and evidence needed to compare observations honestly.

## Freshness

Define feature-specific freshness windows and show last fetched time. A failed refresh does not update the last-success timestamp. Never replace absent values with zero unless zero is semantically accurate and the source confirms it.
