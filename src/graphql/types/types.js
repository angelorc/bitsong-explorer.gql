export default `
  type Delegations {
    delegators: [Delegator]
    total_delegator_num: Int
  }
  type Delegator {
    delegator_address: String
    validator_address: String
    shares: String
  }
  type Query {
    validators(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Validator]
    delegations(operatorAddress: String!): Delegations
    accounts(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Account]
    account(address: String!): Account!
    validator(operatorAddress: String!): Validator!
  }
`;