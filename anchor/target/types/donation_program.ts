/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/donation_program.json`.
 */
export type DonationProgram = {
  "address": "AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ",
  "metadata": {
    "name": "donationProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addGasBudget",
      "discriminator": [
        98,
        50,
        9,
        60,
        81,
        211,
        236,
        187
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "donationAccount",
          "writable": true
        },
        {
          "name": "gasVault",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeDonation",
      "discriminator": [
        126,
        69,
        140,
        217,
        145,
        65,
        209,
        132
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "donationAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  110,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "escrowToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "donationAccount"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "fromToken",
          "writable": true
        },
        {
          "name": "recipient"
        },
        {
          "name": "gasVault",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "totalAmount",
          "type": "u64"
        },
        {
          "name": "intervalAmount",
          "type": "u64"
        },
        {
          "name": "intervalSeconds",
          "type": "i64"
        },
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "gasBudget",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "donorInfo",
          "type": {
            "defined": {
              "name": "donorInfo"
            }
          }
        }
      ]
    },
    {
      "name": "releaseDonation",
      "discriminator": [
        125,
        233,
        243,
        155,
        158,
        55,
        120,
        77
      ],
      "accounts": [
        {
          "name": "executor",
          "signer": true
        },
        {
          "name": "donationAccount",
          "writable": true
        },
        {
          "name": "escrowToken",
          "writable": true
        },
        {
          "name": "recipientToken",
          "writable": true
        },
        {
          "name": "gasVault",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gasFee",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "donationAccount",
      "discriminator": [
        208,
        185,
        79,
        81,
        40,
        112,
        29,
        184
      ]
    }
  ],
  "events": [
    {
      "name": "donationInitialized",
      "discriminator": [
        123,
        235,
        85,
        140,
        69,
        63,
        199,
        147
      ]
    },
    {
      "name": "donationReleased",
      "discriminator": [
        107,
        31,
        96,
        27,
        26,
        59,
        254,
        66
      ]
    },
    {
      "name": "gasBudgetAdded",
      "discriminator": [
        154,
        70,
        192,
        64,
        185,
        136,
        94,
        210
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidAmount",
      "msg": "Invalid donation amount"
    },
    {
      "code": 6001,
      "name": "invalidGasBudget",
      "msg": "Invalid gas budget amount"
    },
    {
      "code": 6002,
      "name": "invalidInterval",
      "msg": "Invalid release time interval"
    },
    {
      "code": 6003,
      "name": "invalidStartTime",
      "msg": "Invalid start time"
    },
    {
      "code": 6004,
      "name": "notStarted",
      "msg": "Donation has not started yet"
    },
    {
      "code": 6005,
      "name": "insufficientGas",
      "msg": "Insufficient gas budget"
    },
    {
      "code": 6006,
      "name": "tooEarly",
      "msg": "Too early for next release"
    },
    {
      "code": 6007,
      "name": "noRemainingAmount",
      "msg": "No remaining amount to release"
    },
    {
      "code": 6008,
      "name": "calculationOverflow",
      "msg": "Calculation overflow occurred"
    },
    {
      "code": 6009,
      "name": "invalidRecipient",
      "msg": "Invalid recipient account"
    },
    {
      "code": 6010,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in escrow account"
    },
    {
      "code": 6011,
      "name": "invalidDonorInfo",
      "msg": "Invalid donor information"
    }
  ],
  "types": [
    {
      "name": "donationAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "escrow",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "intervalAmount",
            "type": "u64"
          },
          {
            "name": "intervalSeconds",
            "type": "i64"
          },
          {
            "name": "claimedAmount",
            "type": "u64"
          },
          {
            "name": "lastReleaseTime",
            "type": "i64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "gasBudget",
            "type": "u64"
          },
          {
            "name": "gasUsed",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "donorInfo",
            "type": {
              "defined": {
                "name": "donorInfo"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "usdValue",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "donationInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "donationAccount",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "intervalAmount",
            "type": "u64"
          },
          {
            "name": "intervalSeconds",
            "type": "i64"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "donorName",
            "type": "string"
          },
          {
            "name": "donorTwitter",
            "type": "string"
          },
          {
            "name": "usdValue",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "donationReleased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "donationAccount",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "donorInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "twitterHandle",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "gasBudgetAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "donationAccount",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
