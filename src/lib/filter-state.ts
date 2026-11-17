/**
 * Immutable value object representing the current filter state (primary value,
 * tags, page). All mutation methods return a new instance — no side effects.
 *
 * Keeping URL parsing / serialisation here means it's testable without
 * mocking Next.js Router.
 */
export class FilterState {
  constructor(
    readonly primaryValue: string,
    readonly tags: string[],
    readonly page: number,
  ) {}

  static fromSearchParams(params: URLSearchParams, primaryKey: string): FilterState {
    const raw = params.get('tags');
    return new FilterState(
      params.get(primaryKey) ?? '',
      raw ? raw.split(',') : [],
      Number(params.get('page')) || 1,
    );
  }

  withPrimary(value: string): FilterState {
    return new FilterState(
      this.primaryValue === value ? '' : value,
      this.tags,
      1,
    );
  }

  withTag(tag: string): FilterState {
    const next = this.tags.includes(tag)
      ? this.tags.filter(t => t !== tag)
      : [...this.tags, tag];
    return new FilterState(this.primaryValue, next, 1);
  }

  withoutTags(): FilterState {
    return new FilterState(this.primaryValue, [], 1);
  }

  get hasFilter(): boolean {
    return !!(this.primaryValue || this.tags.length > 0);
  }

  toSearchParams(primaryKey: string): URLSearchParams {
    const params = new URLSearchParams();
    if (this.primaryValue)  params.set(primaryKey, this.primaryValue);
    if (this.tags.length)   params.set('tags', this.tags.join(','));
    if (this.page > 1)      params.set('page', String(this.page));
    return params;
  }
}
