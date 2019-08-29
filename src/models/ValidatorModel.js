import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

/**
 * Model for a single validator.
 *
 * @type {"mongoose".Schema}
 */
const validatorSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      index: true
    },
    voting_power: {
      type: Number,
      required: true
    },
    proposer_priority: {
      type: Number,
      required: true
    },
    uptime: {
      type: Schema.Types.ObjectId,
      ref: "Uptime"
    },
    details: {
      operatorAddress: {
        type: String,
        required: true
      },
      delegatorAddress: {
        type: String,
        required: true
      },
      consensusPubkey: {
        type: String,
        required: true
      },
      jailed: {
        type: Boolean,
        required: true,
        default: false
      },
      status: {
        type: String,
        required: true
      },
      tokens: {
        type: String,
        required: true
      },
      delegatorShares: {
        type: String
      },
      description: {
        moniker: {
          type: String,
          required: true
        },
        identity: {
          type: String
        },
        website: {
          type: String
        },
        profile_url: {
          type: String
        },
        details: {
          type: String
        }
      },
      commission: {
        rate: {
          type: String
        },
        maxRate: {
          type: String
        },
        maxChangeRate: {
          type: String
        },
        updateTime: {
          type: String
        }
      }
    }
  },
  {
    versionKey: false
  }
);

// indices
validatorSchema.index({ address: 1 }, { name: "validatorAddressIndex" });

validatorSchema.plugin(mongoosePaginate);

const Validator = mongoose.model("Validator", validatorSchema);

export default Validator;