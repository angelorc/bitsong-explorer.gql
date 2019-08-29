import xss from "xss-filters";
import config from "../../config";
import fetch from "node-fetch";
import Account from "../../models/AccountModel";

const getDelegations = delegatorAddr =>
  fetch(`${config.stargate}/staking/delegators/${delegatorAddr}/delegations`)
    .then(res => res.json())
    .then(res => {
      if (res.error) throw res.error;

      return res.result;
    });

const getUnbondingDelegations = delegatorAddr =>
  fetch(
    `${config.stargate}/staking/delegators/${delegatorAddr}/unbonding_delegations`
  )
    .then(res => res.json())
    .then(res => {
      if (res.error) throw res.error;

      return res.result;
    });

const getRedelegations = delegatorAddr =>
  fetch(`${config.stargate}/staking/redelegations`)
    .then(res => res.json())
    .then(res => {
      if (res.error) throw res.error;

      return res.result;
    });

export default {
  Balances: {
    available: account => {
      return fetch(`${config.stargate}/bank/balances/${account.address}`)
        .then(res => res.json())
        .then(response => {
          if (response.error) {
            throw response.error;
          }

          if (response.result.length === 0) {
            return 0;
          }

          return response.result[0].amount;
        });
    },
    bonded: account => {
      return fetch(
        `${config.stargate}/staking/delegators/${account.address}/delegations`
      )
        .then(res => res.json())
        .then(response => {
          if (response.error) {
            throw response.error;
          }

          if (response.result.length === 0) {
            return 0;
          }

          let bondedBalance = 0;

          for (const balance of response.result) {
            bondedBalance += parseFloat(balance.shares);
          }

          return bondedBalance;
        });
    },
    unbonding: account => {
      return fetch(
        `${config.stargate}/staking/delegators/${account.address}/unbonding_delegations`
      )
        .then(res => res.json())
        .then(response => {
          if (response.error) {
            throw response.error;
          }

          if (response.result.length === 0) {
            return 0;
          }

          let unbondingBalance = 0;

          const unbondings = response.result;

          for (const unbond of unbondings) {
            for (const entry of unbond.entries) {
              unbondingBalance += parseFloat(entry.balance);
            }
          }

          return unbondingBalance;
        });
    },
    rewards: account => {
      return fetch(
        `${config.stargate}/distribution/delegators/${account.address}/rewards`
      )
        .then(res => res.json())
        .then(response => {
          if (response.error) {
            throw response.error;
          }

          if (response.result.rewards === null) {
            return 0;
          }

          if (response.result.rewards[0].reward.length === 0) {
            return 0;
          }

          return response.result.rewards[0].reward[0].amount;
        });
    }
  },
  Account: {
    balances: account => {
      return {
        ...account
      };
    },
    delegations: async account => {
      return await getDelegations(account.address);
    },
    unbonding_delegations: async account => {
      return await getUnbondingDelegations(account.address);
    },
    redelegations: async account => {
      return await getRedelegations();
    }
  },
  Query: {
    account: async (root, args) => {
      const address = args.address;

      if (!address) {
        throw Error("Invalid address");
      }

      return {
        address: address
      };
    },
    accounts: (root, args, context) => {
      const queryParams = extractQueryParams(args);
      const query = {};

      return Account.paginate(query, {
        page: queryParams.page,
        limit: queryParams.limit
      })
        .then(accounts => {
          return accounts.docs.map(account => {
            return account;
          });
        })
        .catch(err => {
          throw err;
        });
    }
  }
};
