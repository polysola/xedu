import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Clear old data
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    // Courses
    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "XRP Basics",
        imageSrc: "/es.svg",
      },
      {
        id: 2,
        title: "XRP Advanced",
        imageSrc: "/it.svg",
      },
      {
        id: 3,
        title: "XRP DeFi",
        imageSrc: "/fr.svg",
      },
      {
        id: 4,
        title: "XRP Development",
        imageSrc: "/hr.svg",
      },
    ]);

    // Units
    await db.insert(schema.units).values([
      // XRP Basics Units
      {
        id: 1,
        courseId: 1,
        title: "Unit 1",
        description: "XRP Fundamentals",
        order: 1,
      },
      {
        id: 2,
        courseId: 1,
        title: "Unit 2",
        description: "XRP Technology",
        order: 2,
      },
      // XRP Advanced Units
      {
        id: 3,
        courseId: 2,
        title: "Unit 1",
        description: "Advanced Concepts",
        order: 1,
      },
      {
        id: 4,
        courseId: 2,
        title: "Unit 2",
        description: "Advanced Features",
        order: 2,
      },
      // XRP DeFi Units
      {
        id: 5,
        courseId: 3,
        title: "Unit 1",
        description: "DeFi Basics",
        order: 1,
      },
      // XRP Development Units
      {
        id: 6,
        courseId: 4,
        title: "Unit 1",
        description: "Development Basics",
        order: 1,
      }
    ]);

    // Lessons
    await db.insert(schema.lessons).values([
      // XRP Basics Lessons
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: "XRP Introduction",
      },
      {
        id: 2,
        unitId: 1,
        order: 2,
        title: "Wallet & Transactions",
      },
      {
        id: 3,
        unitId: 1,
        order: 3,
        title: "Network & Consensus",
      },
      {
        id: 4,
        unitId: 2,
        order: 1,
        title: "Smart Contracts",
      },
      {
        id: 5,
        unitId: 2,
        order: 2,
        title: "DeFi Applications",
      },
      // XRP Advanced Lessons
      {
        id: 6,
        unitId: 3,
        order: 1,
        title: "Advanced Features",
      },
      {
        id: 7,
        unitId: 4,
        order: 1,
        title: "Payment Channels",
      },
      // XRP DeFi Lessons
      {
        id: 8,
        unitId: 5,
        order: 1,
        title: "AMM & Liquidity",
      },
      // XRP Development Lessons
      {
        id: 9,
        unitId: 6,
        order: 1,
        title: "XRPL SDK",
      }
    ]);

    // XRP Basics - Introduction Questions
    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: "SELECT",
        order: 1,
        question: 'Who created XRP?',
      },
      {
        id: 2,
        lessonId: 1,
        type: "SELECT",
        order: 2,
        question: 'When was XRP launched?',
      },
      {
        id: 3,
        lessonId: 1,
        type: "SELECT",
        order: 3,
        question: 'What is the main purpose of XRP?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 1 options
      {
        challengeId: 1,
        imageSrc: "/woman.svg",
        correct: false,
        text: "Satoshi Nakamoto",
      },
      {
        challengeId: 1,
        imageSrc: "/man.svg",
        correct: true,
        text: "Ripple Labs",
      },
      {
        challengeId: 1,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Vitalik Buterin",
      },
      // Question 2 options
      {
        challengeId: 2,
        imageSrc: "/robot.svg",
        correct: false,
        text: "2015",
      },
      {
        challengeId: 2,
        imageSrc: "/man.svg",
        correct: true,
        text: "2012",
      },
      {
        challengeId: 2,
        imageSrc: "/woman.svg",
        correct: false,
        text: "2017",
      },
      // Question 3 options
      {
        challengeId: 3,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Smart contracts platform",
      },
      {
        challengeId: 3,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Cross-border payments",
      },
      {
        challengeId: 3,
        imageSrc: "/man.svg",
        correct: false,
        text: "Digital gold",
      }
    ]);

    // XRP Basics - Wallet & Transactions
    await db.insert(schema.challenges).values([
      {
        id: 4,
        lessonId: 2,
        type: "SELECT",
        order: 1,
        question: 'What is the minimum XRP required for a wallet?',
      },
      {
        id: 5,
        lessonId: 2,
        type: "SELECT",
        order: 2,
        question: 'What is the average XRP transaction time?',
      },
      {
        id: 6,
        lessonId: 2,
        type: "SELECT",
        order: 3,
        question: 'What happens to XRP transaction fees?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 4 options
      {
        challengeId: 4,
        imageSrc: "/robot.svg",
        correct: false,
        text: "20 XRP",
      },
      {
        challengeId: 4,
        imageSrc: "/woman.svg",
        correct: true,
        text: "10 XRP",
      },
      {
        challengeId: 4,
        imageSrc: "/man.svg",
        correct: false,
        text: "50 XRP",
      },
      // Question 5 options
      {
        challengeId: 5,
        imageSrc: "/woman.svg",
        correct: true,
        text: "3-5 seconds",
      },
      {
        challengeId: 5,
        imageSrc: "/man.svg",
        correct: false,
        text: "1 minute",
      },
      {
        challengeId: 5,
        imageSrc: "/robot.svg",
        correct: false,
        text: "10 minutes",
      },
      // Question 6 options
      {
        challengeId: 6,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Given to validators",
      },
      {
        challengeId: 6,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Burned forever",
      },
      {
        challengeId: 6,
        imageSrc: "/man.svg",
        correct: false,
        text: "Returned to Ripple",
      }
    ]);

    // XRP Basics - Network & Consensus
    await db.insert(schema.challenges).values([
      {
        id: 7,
        lessonId: 3,
        type: "SELECT",
        order: 1,
        question: 'What consensus mechanism does XRP use?',
      },
      {
        id: 8,
        lessonId: 3,
        type: "SELECT",
        order: 2,
        question: 'How many validators are needed for consensus?',
      },
      {
        id: 9,
        lessonId: 3,
        type: "SELECT",
        order: 3,
        question: 'What is the XRP Ledger consensus interval?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 7 options
      {
        challengeId: 7,
        imageSrc: "/woman.svg",
        correct: true,
        text: "RPCA (Ripple Protocol Consensus Algorithm)",
      },
      {
        challengeId: 7,
        imageSrc: "/man.svg",
        correct: false,
        text: "Proof of Work",
      },
      {
        challengeId: 7,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Proof of Stake",
      },
      // Question 8 options
      {
        challengeId: 8,
        imageSrc: "/robot.svg",
        correct: false,
        text: "51% of all validators",
      },
      {
        challengeId: 8,
        imageSrc: "/woman.svg",
        correct: true,
        text: "80% of trusted validators",
      },
      {
        challengeId: 8,
        imageSrc: "/man.svg",
        correct: false,
        text: "All validators must agree",
      },
      // Question 9 options
      {
        challengeId: 9,
        imageSrc: "/man.svg",
        correct: false,
        text: "10 seconds",
      },
      {
        challengeId: 9,
        imageSrc: "/woman.svg",
        correct: true,
        text: "3-5 seconds",
      },
      {
        challengeId: 9,
        imageSrc: "/robot.svg",
        correct: false,
        text: "1 minute",
      }
    ]);

    // XRP Advanced - Features
    await db.insert(schema.challenges).values([
      {
        id: 10,
        lessonId: 6,
        type: "SELECT",
        order: 1,
        question: 'What is Escrow in XRPL?',
      },
      {
        id: 11,
        lessonId: 6,
        type: "SELECT",
        order: 2,
        question: 'What is a Trust Line in XRPL?',
      },
      {
        id: 12,
        lessonId: 6,
        type: "SELECT",
        order: 3,
        question: 'What is Multi-signing in XRPL?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 10 options
      {
        challengeId: 10,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Payment gateway",
      },
      {
        challengeId: 10,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Time-locked XRP payments",
      },
      {
        challengeId: 10,
        imageSrc: "/man.svg",
        correct: false,
        text: "Trading platform",
      },
      // Question 11 options
      {
        challengeId: 11,
        imageSrc: "/man.svg",
        correct: false,
        text: "Network connection",
      },
      {
        challengeId: 11,
        imageSrc: "/robot.svg",
        correct: true,
        text: "Authorization to hold tokens",
      },
      {
        challengeId: 11,
        imageSrc: "/woman.svg",
        correct: false,
        text: "Validator connection",
      },
      // Question 12 options
      {
        challengeId: 12,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Multiple signatures required for transactions",
      },
      {
        challengeId: 12,
        imageSrc: "/man.svg",
        correct: false,
        text: "Multiple accounts",
      },
      {
        challengeId: 12,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Multiple currencies",
      }
    ]);

    // XRP Advanced - Payment Channels
    await db.insert(schema.challenges).values([
      {
        id: 13,
        lessonId: 7,
        type: "SELECT",
        order: 1,
        question: 'What are Payment Channels used for?',
      },
      {
        id: 14,
        lessonId: 7,
        type: "SELECT",
        order: 2,
        question: 'How to close a Payment Channel?',
      },
      {
        id: 15,
        lessonId: 7,
        type: "SELECT",
        order: 3,
        question: 'What is the advantage of Payment Channels?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 13 options
      {
        challengeId: 13,
        imageSrc: "/robot.svg",
        correct: true,
        text: "Streaming micro-payments",
      },
      {
        challengeId: 13,
        imageSrc: "/man.svg",
        correct: false,
        text: "Large transactions",
      },
      {
        challengeId: 13,
        imageSrc: "/woman.svg",
        correct: false,
        text: "Token creation",
      },
      // Question 14 options
      // ... (giữ phần code trước đó giống nhau đến challengeId 13)

      // Question 14 options
      {
        challengeId: 14,
        imageSrc: "/woman.svg",
        correct: false,
        text: "Delete account",
      },
      {
        challengeId: 14,
        imageSrc: "/robot.svg",
        correct: true,
        text: "Submit claim and close request",
      },
      {
        challengeId: 14,
        imageSrc: "/man.svg",
        correct: false,
        text: "Wait for timeout",
      },
      // Question 15 options
      {
        challengeId: 15,
        imageSrc: "/man.svg",
        correct: false,
        text: "Lower fees",
      },
      {
        challengeId: 15,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Instant settlement off-ledger",
      },
      {
        challengeId: 15,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Better security",
      }
    ]);

    // XRP DeFi Questions - AMM & Liquidity
    await db.insert(schema.challenges).values([
      {
        id: 16,
        lessonId: 8,
        type: "SELECT",
        order: 1,
        question: 'What is an Automated Market Maker (AMM)?',
      },
      {
        id: 17,
        lessonId: 8,
        type: "SELECT",
        order: 2,
        question: 'What is the minimum liquidity provider fee?',
      },
      {
        id: 18,
        lessonId: 8,
        type: "SELECT",
        order: 3,
        question: 'How do LP tokens work in XRPL?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 16 options
      {
        challengeId: 16,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Trading bot",
      },
      {
        challengeId: 16,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Self-executing liquidity protocol",
      },
      {
        challengeId: 16,
        imageSrc: "/man.svg",
        correct: false,
        text: "Exchange platform",
      },
      // Question 17 options
      {
        challengeId: 17,
        imageSrc: "/man.svg",
        correct: false,
        text: "0.1%",
      },
      {
        challengeId: 17,
        imageSrc: "/robot.svg",
        correct: true,
        text: "0.2%",
      },
      {
        challengeId: 17,
        imageSrc: "/woman.svg",
        correct: false,
        text: "0.3%",
      },
      // Question 18 options
      {
        challengeId: 18,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Represent share of liquidity pool",
      },
      {
        challengeId: 18,
        imageSrc: "/man.svg",
        correct: false,
        text: "Used for governance",
      },
      {
        challengeId: 18,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Traded like normal tokens",
      }
    ]);

    // Development Questions - XRPL SDK
    await db.insert(schema.challenges).values([
      {
        id: 19,
        lessonId: 9,
        type: "SELECT",
        order: 1,
        question: 'Which library is used for XRPL in JavaScript?',
      },
      {
        id: 20,
        lessonId: 9,
        type: "SELECT",
        order: 2,
        question: 'How to connect to XRPL testnet?',
      },
      {
        id: 21,
        lessonId: 9,
        type: "SELECT",
        order: 3,
        question: 'What is a Wallet in xrpl.js?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 19 options
      {
        challengeId: 19,
        imageSrc: "/woman.svg",
        correct: false,
        text: "web3.js",
      },
      {
        challengeId: 19,
        imageSrc: "/robot.svg",
        correct: true,
        text: "xrpl.js",
      },
      {
        challengeId: 19,
        imageSrc: "/man.svg",
        correct: false,
        text: "ripple-lib",
      },
      // Question 20 options
      {
        challengeId: 20,
        imageSrc: "/man.svg",
        correct: false,
        text: "testnet.connect()",
      },
      {
        challengeId: 20,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Client.connect('wss://s.altnet.rippletest.net')",
      },
      {
        challengeId: 20,
        imageSrc: "/robot.svg",
        correct: false,
        text: "connect('testnet')",
      },
      // Question 21 options
      {
        challengeId: 21,
        imageSrc: "/robot.svg",
        correct: true,
        text: "Class for managing keys and signing",
      },
      {
        challengeId: 21,
        imageSrc: "/man.svg",
        correct: false,
        text: "User interface",
      },
      {
        challengeId: 21,
        imageSrc: "/woman.svg",
        correct: false,
        text: "Storage container",
      }
    ]);

    // Additional Development Questions
    await db.insert(schema.challenges).values([
      {
        id: 22,
        lessonId: 9,
        type: "SELECT",
        order: 4,
        question: 'How to create a transaction?',
      },
      {
        id: 23,
        lessonId: 9,
        type: "SELECT",
        order: 5,
        question: 'What is autofilling in XRPL?',
      }
    ]);

    await db.insert(schema.challengeOptions).values([
      // Question 22 options
      {
        challengeId: 22,
        imageSrc: "/robot.svg",
        correct: false,
        text: "makeTransaction()",
      },
      {
        challengeId: 22,
        imageSrc: "/woman.svg",
        correct: true,
        text: "client.autofill(tx_json)",
      },
      {
        challengeId: 22,
        imageSrc: "/man.svg",
        correct: false,
        text: "createTx()",
      },
      // Question 23 options
      {
        challengeId: 23,
        imageSrc: "/woman.svg",
        correct: true,
        text: "Automatically add required fields",
      },
      {
        challengeId: 23,
        imageSrc: "/man.svg",
        correct: false,
        text: "Fill wallet with XRP",
      },
      {
        challengeId: 23,
        imageSrc: "/robot.svg",
        correct: false,
        text: "Complete transaction data",
      }
    ]);

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();