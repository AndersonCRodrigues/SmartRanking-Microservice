import * as mongoose from 'mongoose';
import { ChallengeStatus } from './challenge.status.enum';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateHourChallenge: { type: Date },
    status: { type: String, default: ChallengeStatus.PENDING },
    dateHourRequest: { type: Date, default: Date.now },
    dateHourResponse: { type: Date },
    category: { type: String },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  {
    timestamps: true,
    collection: 'challenges',
  },
);
