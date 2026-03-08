import { describe, it, expect, beforeEach } from "vitest";
import { Cl, ClarityType } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

describe("StackPool Contract", () => {
  // =====================
  // Pool Creation
  // =====================

  describe("create-pool", () => {
    it("should create a pool successfully", () => {
      const deadline = simnet.blockHeight + 100;
      const { result } = simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Mombasa Trip"),
          Cl.stringUtf8("Collecting for beach holiday"),
          Cl.uint(10_000_000), // 10 STX target
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(1_000_000), // 1 STX minimum
          Cl.bool(true),
        ],
        deployer
      );

      expect(result).toBeOk(Cl.uint(0)); // first pool = ID 0
    });

    it("should increment pool count", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Pool A"),
          Cl.stringUtf8("First pool"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Pool B"),
          Cl.stringUtf8("Second pool"),
          Cl.uint(8_000_000),
          Cl.principal(wallet2),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(false),
        ],
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        "stackpool",
        "get-pool-count",
        [],
        deployer
      );

      expect(result).toBeUint(2);
    });

    it("should reject zero target amount", () => {
      const deadline = simnet.blockHeight + 100;
      const { result } = simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Bad Pool"),
          Cl.stringUtf8("Zero target"),
          Cl.uint(0),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      expect(result).toBeErr(Cl.uint(110)); // ERR_INVALID_TARGET
    });

    it("should reject deadline in the past", () => {
      const { result } = simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Expired Pool"),
          Cl.stringUtf8("Already past"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(1), // block 1 is in the past
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      expect(result).toBeErr(Cl.uint(111)); // ERR_INVALID_DEADLINE
    });
  });

  // =====================
  // Contributions
  // =====================

  describe("contribute", () => {
    it("should accept a contribution", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Test Pool"),
          Cl.stringUtf8("For testing contributions"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(3_000_000)],
        wallet2
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should track contribution amounts", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Tracking Pool"),
          Cl.stringUtf8("Track amounts"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(2_000_000)],
        wallet2
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(1_000_000)],
        wallet2
      );

      const { result } = simnet.callReadOnlyFn(
        "stackpool",
        "get-contribution",
        [Cl.uint(0), Cl.principal(wallet2)],
        deployer
      );

      expect(result).toBeUint(3_000_000); // cumulative
    });

    it("should mark pool as complete when target is hit", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Small Pool"),
          Cl.stringUtf8("Easy target"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(5_000_000)],
        wallet2
      );

      const { result } = simnet.callReadOnlyFn(
        "stackpool",
        "is-pool-funded",
        [Cl.uint(0)],
        deployer
      );

      expect(result).toBeBool(true);
    });

    it("should reject contribution to a non-existent pool", () => {
      const { result } = simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(999), Cl.uint(1_000_000)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(101)); // ERR_POOL_NOT_FOUND
    });

    it("should reject zero amount contributions", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("No Zero Pool"),
          Cl.stringUtf8("Reject zero"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(0)],
        wallet2
      );

      expect(result).toBeErr(Cl.uint(108)); // ERR_AMOUNT_TOO_LOW
    });

    it("should enforce minimum contribution for first-time contributors", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Min Pool"),
          Cl.stringUtf8("Has minimum"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(2_000_000), // 2 STX minimum
          Cl.bool(true),
        ],
        deployer
      );

      // Below minimum — should fail
      const { result: fail } = simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(1_000_000)],
        wallet2
      );
      expect(fail).toBeErr(Cl.uint(113)); // ERR_BELOW_MINIMUM

      // At minimum — should succeed
      const { result: pass } = simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(2_000_000)],
        wallet2
      );
      expect(pass).toBeOk(Cl.bool(true));

      // Second contribution below minimum — should succeed (existing contributor)
      const { result: second } = simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(500_000)],
        wallet2
      );
      expect(second).toBeOk(Cl.bool(true));
    });

    it("should reject contribution after pool is complete", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Done Pool"),
          Cl.stringUtf8("Already funded"),
          Cl.uint(3_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(3_000_000)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(1_000_000)],
        wallet3
      );

      expect(result).toBeErr(Cl.uint(102)); // ERR_POOL_ALREADY_COMPLETE
    });
  });

  // =====================
  // Withdrawal
  // =====================

  describe("withdraw-funds", () => {
    it("should allow creator to withdraw from funded pool", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Withdraw Pool"),
          Cl.stringUtf8("Ready to withdraw"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(5_000_000)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "withdraw-funds",
        [Cl.uint(0)],
        deployer
      );

      expect(result).toBeOk(Cl.uint(5_000_000));
    });

    it("should reject withdrawal from unfunded pool", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Partial Pool"),
          Cl.stringUtf8("Not yet funded"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(3_000_000)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "withdraw-funds",
        [Cl.uint(0)],
        deployer
      );

      expect(result).toBeErr(Cl.uint(105)); // ERR_POOL_NOT_FUNDED
    });

    it("should reject withdrawal by non-creator", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Auth Pool"),
          Cl.stringUtf8("Creator only"),
          Cl.uint(3_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(3_000_000)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "withdraw-funds",
        [Cl.uint(0)],
        wallet2 // not the creator
      );

      expect(result).toBeErr(Cl.uint(100)); // ERR_NOT_AUTHORIZED
    });

    it("should reject double withdrawal", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Double Pool"),
          Cl.stringUtf8("No double withdraw"),
          Cl.uint(3_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(3_000_000)],
        wallet2
      );

      simnet.callPublicFn(
        "stackpool",
        "withdraw-funds",
        [Cl.uint(0)],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "withdraw-funds",
        [Cl.uint(0)],
        deployer
      );

      expect(result).toBeErr(Cl.uint(112)); // ERR_ALREADY_WITHDRAWN
    });
  });

  // =====================
  // Cancel Pool
  // =====================

  describe("cancel-pool", () => {
    it("should allow creator to cancel pool with no contributions", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Cancel Pool"),
          Cl.stringUtf8("Will be cancelled"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "cancel-pool",
        [Cl.uint(0)],
        deployer
      );

      expect(result).toBeOk(Cl.bool(true));
    });

    it("should reject cancel by non-creator", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("No Cancel"),
          Cl.stringUtf8("Not your pool"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "cancel-pool",
        [Cl.uint(0)],
        wallet1
      );

      expect(result).toBeErr(Cl.uint(100)); // ERR_NOT_AUTHORIZED
    });

    it("should reject cancel when pool has contributions", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Has Contrib"),
          Cl.stringUtf8("Cannot cancel"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(1_000_000)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "cancel-pool",
        [Cl.uint(0)],
        deployer
      );

      expect(result).toBeErr(Cl.uint(107)); // ERR_POOL_HAS_CONTRIBUTIONS
    });
  });

  // =====================
  // Refunds
  // =====================

  describe("refund-contributor", () => {
    it("should refund contributor after pool expires", () => {
      const deadline = simnet.blockHeight + 5;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Expiring Pool"),
          Cl.stringUtf8("Will expire soon"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(3_000_000)],
        wallet2
      );

      // Advance past deadline
      simnet.mineEmptyBlocks(10);

      const { result } = simnet.callPublicFn(
        "stackpool",
        "refund-contributor",
        [Cl.uint(0), Cl.uint(0)], // contributor index 0
        wallet3 // anyone can trigger
      );

      expect(result).toBeOk(Cl.uint(3_000_000));
    });

    it("should reject refund before deadline", () => {
      const deadline = simnet.blockHeight + 200;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Active Pool"),
          Cl.stringUtf8("Still active"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(2_000_000)],
        wallet2
      );

      const { result } = simnet.callPublicFn(
        "stackpool",
        "refund-contributor",
        [Cl.uint(0), Cl.uint(0)],
        wallet3
      );

      expect(result).toBeErr(Cl.uint(104)); // ERR_POOL_NOT_EXPIRED
    });
  });

  // =====================
  // Read-Only Functions
  // =====================

  describe("read-only functions", () => {
    it("should return pool data via get-pool", () => {
      const deadline = simnet.blockHeight + 100;

      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Read Pool"),
          Cl.stringUtf8("For reading"),
          Cl.uint(8_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(500_000),
          Cl.bool(true),
        ],
        deployer
      );

      const { result } = simnet.callReadOnlyFn(
        "stackpool",
        "get-pool",
        [Cl.uint(0)],
        deployer
      );

      expect(result).toBeSome(
        Cl.tuple({
          title: Cl.stringUtf8("Read Pool"),
          description: Cl.stringUtf8("For reading"),
          "target-amount": Cl.uint(8_000_000),
          "current-amount": Cl.uint(0),
          creator: Cl.principal(deployer),
          recipient: Cl.principal(wallet1),
          deadline: Cl.uint(deadline),
          "min-contribution": Cl.uint(500_000),
          "is-complete": Cl.bool(false),
          "is-refunded": Cl.bool(false),
          "is-withdrawn": Cl.bool(false),
          "is-public": Cl.bool(true),
          "contributor-count": Cl.uint(0),
        })
      );
    });

    it("should return none for non-existent pool", () => {
      const { result } = simnet.callReadOnlyFn(
        "stackpool",
        "get-pool",
        [Cl.uint(999)],
        deployer
      );

      expect(result).toBeNone();
    });
  });

  // =====================
  // Full Lifecycle
  // =====================

  describe("full pool lifecycle", () => {
    it("should handle create -> contribute -> fund -> withdraw", () => {
      const deadline = simnet.blockHeight + 100;

      // Create
      const { result: createResult } = simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Lifecycle Pool"),
          Cl.stringUtf8("Full lifecycle test"),
          Cl.uint(5_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );
      expect(createResult).toBeOk(Cl.uint(0));

      // Contribute (partial)
      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(2_000_000)],
        wallet2
      );

      // Check not funded yet
      const { result: notFunded } = simnet.callReadOnlyFn(
        "stackpool",
        "is-pool-funded",
        [Cl.uint(0)],
        deployer
      );
      expect(notFunded).toBeBool(false);

      // Contribute (complete)
      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(3_000_000)],
        wallet3
      );

      // Check funded
      const { result: funded } = simnet.callReadOnlyFn(
        "stackpool",
        "is-pool-funded",
        [Cl.uint(0)],
        deployer
      );
      expect(funded).toBeBool(true);

      // Withdraw
      const { result: withdrawResult } = simnet.callPublicFn(
        "stackpool",
        "withdraw-funds",
        [Cl.uint(0)],
        deployer
      );
      expect(withdrawResult).toBeOk(Cl.uint(5_000_000));
    });

    it("should handle create -> contribute -> expire -> refund", () => {
      const deadline = simnet.blockHeight + 5;

      // Create
      simnet.callPublicFn(
        "stackpool",
        "create-pool",
        [
          Cl.stringUtf8("Expiry Pool"),
          Cl.stringUtf8("Will expire and refund"),
          Cl.uint(10_000_000),
          Cl.principal(wallet1),
          Cl.uint(deadline),
          Cl.uint(0),
          Cl.bool(true),
        ],
        deployer
      );

      // Two contributors
      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(2_000_000)],
        wallet2
      );

      simnet.callPublicFn(
        "stackpool",
        "contribute",
        [Cl.uint(0), Cl.uint(1_000_000)],
        wallet3
      );

      // Advance past deadline
      simnet.mineEmptyBlocks(10);

      // Refund contributor 0 (wallet2)
      const { result: refund1 } = simnet.callPublicFn(
        "stackpool",
        "refund-contributor",
        [Cl.uint(0), Cl.uint(0)],
        deployer
      );
      expect(refund1).toBeOk(Cl.uint(2_000_000));

      // Refund contributor 1 (wallet3)
      const { result: refund2 } = simnet.callPublicFn(
        "stackpool",
        "refund-contributor",
        [Cl.uint(0), Cl.uint(1)],
        deployer
      );
      expect(refund2).toBeOk(Cl.uint(1_000_000));

      // Finalize
      const { result: finalize } = simnet.callPublicFn(
        "stackpool",
        "finalize-refund",
        [Cl.uint(0)],
        deployer
      );
      expect(finalize).toBeOk(Cl.bool(true));
    });
  });
});
