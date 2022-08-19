import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repository/repository-contracts";
import { Supplier } from "#supplier/domain/entities/supplier";

export namespace SupplierRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Supplier, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Supplier,
      Filter,
      SearchParams,
      SearchResult
    > {}
}

export default SupplierRepository;
