import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repository/repository-contracts";
import { Budget } from "#budget/domain/entities/budget";

export namespace BudgetRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Budget, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Budget,
      Filter,
      SearchParams,
      SearchResult
    > {}
}

export default BudgetRepository;
