import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repository/repository-contracts";
import { Expense } from "#expense/domain/entities/expense";

export namespace ExpenseRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Expense, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Expense,
      Filter,
      SearchParams,
      SearchResult
    > {}
}

export default ExpenseRepository;
