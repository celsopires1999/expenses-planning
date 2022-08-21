import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repository/repository-contracts";
import { Team } from "#team/domain/entities/team";

export namespace TeamRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<Team, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      Team,
      Filter,
      SearchParams,
      SearchResult
    > {}
}

export default TeamRepository;
