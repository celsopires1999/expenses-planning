import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "#seedwork/domain/repository/repository-contracts";
import { TeamMember } from "#team-member/domain/entities/team-member";

export namespace TeamMemberRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<TeamMember, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      TeamMember,
      Filter,
      SearchParams,
      SearchResult
    > {}
}

export default TeamMemberRepository;
