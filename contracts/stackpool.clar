;; StackPool - Bitcoin-Powered Group Payments on Stacks
;;
;; A trustless pooling contract that allows groups of people to collectively
;; contribute STX (or sBTC in future) toward a shared goal. Funds are
;; automatically released to the recipient when the target is met, or
;; refunded to all contributors if the deadline passes.

;; ---------------------
;; Constants
;; ---------------------

(define-constant CONTRACT_OWNER tx-sender)

;; Error codes
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_POOL_NOT_FOUND (err u101))
(define-constant ERR_POOL_ALREADY_COMPLETE (err u102))
(define-constant ERR_POOL_EXPIRED (err u103))
(define-constant ERR_POOL_NOT_EXPIRED (err u104))
(define-constant ERR_POOL_NOT_FUNDED (err u105))
(define-constant ERR_POOL_ALREADY_REFUNDED (err u106))
(define-constant ERR_POOL_HAS_CONTRIBUTIONS (err u107))
(define-constant ERR_AMOUNT_TOO_LOW (err u108))
(define-constant ERR_TRANSFER_FAILED (err u109))
(define-constant ERR_INVALID_TARGET (err u110))
(define-constant ERR_INVALID_DEADLINE (err u111))
(define-constant ERR_ALREADY_WITHDRAWN (err u112))
(define-constant ERR_BELOW_MINIMUM (err u113))

;; ---------------------
;; Data Variables
;; ---------------------

(define-data-var pool-count uint u0)

;; ---------------------
;; Data Maps
;; ---------------------

;; Pool metadata
(define-map pools uint
  {
    title: (string-utf8 100),
    description: (string-utf8 280),
    target-amount: uint,
    current-amount: uint,
    creator: principal,
    recipient: principal,
    deadline: uint,
    min-contribution: uint,
    is-complete: bool,
    is-refunded: bool,
    is-withdrawn: bool,
    is-public: bool,
    contributor-count: uint
  }
)

;; Per-contributor tracking
(define-map contributions
  { pool-id: uint, contributor: principal }
  uint
)

;; Track contributors per pool for refunds (up to 200 per pool)
(define-map pool-contributors
  { pool-id: uint, index: uint }
  principal
)

;; ---------------------
;; Read-Only Functions
;; ---------------------

(define-read-only (get-pool (pool-id uint))
  (map-get? pools pool-id)
)

(define-read-only (get-contribution (pool-id uint) (contributor principal))
  (default-to u0 (map-get? contributions { pool-id: pool-id, contributor: contributor }))
)

(define-read-only (get-pool-count)
  (var-get pool-count)
)

(define-read-only (is-pool-funded (pool-id uint))
  (match (map-get? pools pool-id)
    pool (>= (get current-amount pool) (get target-amount pool))
    false
  )
)

(define-read-only (get-pool-contributor (pool-id uint) (index uint))
  (map-get? pool-contributors { pool-id: pool-id, index: index })
)

;; ---------------------
;; Public Functions
;; ---------------------

;; Create a new pool
(define-public (create-pool
    (title (string-utf8 100))
    (description (string-utf8 280))
    (target-amount uint)
    (recipient principal)
    (deadline uint)
    (min-contribution uint)
    (is-public bool)
  )
  (let
    (
      (pool-id (var-get pool-count))
    )
    ;; Validate inputs
    (asserts! (> target-amount u0) ERR_INVALID_TARGET)
    (asserts! (> deadline stacks-block-height) ERR_INVALID_DEADLINE)

    ;; Create the pool
    (map-set pools pool-id
      {
        title: title,
        description: description,
        target-amount: target-amount,
        current-amount: u0,
        creator: tx-sender,
        recipient: recipient,
        deadline: deadline,
        min-contribution: min-contribution,
        is-complete: false,
        is-refunded: false,
        is-withdrawn: false,
        is-public: is-public,
        contributor-count: u0
      }
    )

    ;; Increment pool counter
    (var-set pool-count (+ pool-id u1))

    ;; Return the pool ID
    (ok pool-id)
  )
)

;; Contribute STX to a pool
(define-public (contribute (pool-id uint) (amount uint))
  (let
    (
      (pool (unwrap! (map-get? pools pool-id) ERR_POOL_NOT_FOUND))
      (current-contribution (get-contribution pool-id tx-sender))
      (new-pool-amount (+ (get current-amount pool) amount))
      (contributor-index (get contributor-count pool))
    )
    ;; Pool must not be complete or refunded
    (asserts! (not (get is-complete pool)) ERR_POOL_ALREADY_COMPLETE)
    (asserts! (not (get is-refunded pool)) ERR_POOL_ALREADY_REFUNDED)

    ;; Pool must not have passed its deadline
    (asserts! (<= stacks-block-height (get deadline pool)) ERR_POOL_EXPIRED)

    ;; Amount must be positive
    (asserts! (> amount u0) ERR_AMOUNT_TOO_LOW)

    ;; Check minimum contribution (only for first-time contributors)
    (asserts!
      (or
        (> current-contribution u0)
        (>= amount (get min-contribution pool))
      )
      ERR_BELOW_MINIMUM
    )

    ;; Transfer STX from contributor to contract
    (unwrap! (stx-transfer? amount tx-sender (as-contract tx-sender)) ERR_TRANSFER_FAILED)

    ;; Track contributor if first contribution
    (if (is-eq current-contribution u0)
      (begin
        (map-set pool-contributors
          { pool-id: pool-id, index: contributor-index }
          tx-sender
        )
        (map-set pools pool-id
          (merge pool {
            current-amount: new-pool-amount,
            contributor-count: (+ contributor-index u1),
            is-complete: (>= new-pool-amount (get target-amount pool))
          })
        )
      )
      (map-set pools pool-id
        (merge pool {
          current-amount: new-pool-amount,
          is-complete: (>= new-pool-amount (get target-amount pool))
        })
      )
    )

    ;; Update contribution amount
    (map-set contributions
      { pool-id: pool-id, contributor: tx-sender }
      (+ current-contribution amount)
    )

    (ok true)
  )
)

;; Withdraw funds after pool is fully funded (creator only)
(define-public (withdraw-funds (pool-id uint))
  (let
    (
      (pool (unwrap! (map-get? pools pool-id) ERR_POOL_NOT_FOUND))
      (amount (get current-amount pool))
    )
    ;; Only creator can withdraw
    (asserts! (is-eq tx-sender (get creator pool)) ERR_NOT_AUTHORIZED)

    ;; Pool must be complete (target reached)
    (asserts! (get is-complete pool) ERR_POOL_NOT_FUNDED)

    ;; Must not have already withdrawn
    (asserts! (not (get is-withdrawn pool)) ERR_ALREADY_WITHDRAWN)

    ;; Transfer funds from contract to recipient
    (unwrap! (as-contract (stx-transfer? amount tx-sender (get recipient pool))) ERR_TRANSFER_FAILED)

    ;; Mark as withdrawn
    (map-set pools pool-id
      (merge pool { is-withdrawn: true })
    )

    (ok amount)
  )
)

;; Refund a single contributor from an expired pool
;; Anyone can call this to trigger a refund for a specific contributor
(define-public (refund-contributor (pool-id uint) (contributor-index uint))
  (let
    (
      (pool (unwrap! (map-get? pools pool-id) ERR_POOL_NOT_FOUND))
      (contributor (unwrap! (map-get? pool-contributors { pool-id: pool-id, index: contributor-index }) ERR_POOL_NOT_FOUND))
      (contribution (get-contribution pool-id contributor))
    )
    ;; Pool must have passed its deadline
    (asserts! (> stacks-block-height (get deadline pool)) ERR_POOL_NOT_EXPIRED)

    ;; Pool must not be fully funded
    (asserts! (not (get is-complete pool)) ERR_POOL_ALREADY_COMPLETE)

    ;; Must not have already been fully refunded
    (asserts! (not (get is-refunded pool)) ERR_POOL_ALREADY_REFUNDED)

    ;; Contributor must have a positive balance
    (asserts! (> contribution u0) ERR_AMOUNT_TOO_LOW)

    ;; Transfer refund from contract to contributor
    (unwrap! (as-contract (stx-transfer? contribution tx-sender contributor)) ERR_TRANSFER_FAILED)

    ;; Zero out contributor's balance
    (map-set contributions
      { pool-id: pool-id, contributor: contributor }
      u0
    )

    ;; Update pool amount
    (map-set pools pool-id
      (merge pool {
        current-amount: (- (get current-amount pool) contribution)
      })
    )

    (ok contribution)
  )
)

;; Mark pool as fully refunded (after all individual refunds processed)
(define-public (finalize-refund (pool-id uint))
  (let
    (
      (pool (unwrap! (map-get? pools pool-id) ERR_POOL_NOT_FOUND))
    )
    ;; Pool must have passed deadline
    (asserts! (> stacks-block-height (get deadline pool)) ERR_POOL_NOT_EXPIRED)

    ;; Pool must not be complete
    (asserts! (not (get is-complete pool)) ERR_POOL_ALREADY_COMPLETE)

    ;; Current amount should be zero (all refunds processed)
    (asserts! (is-eq (get current-amount pool) u0) ERR_POOL_HAS_CONTRIBUTIONS)

    ;; Mark as refunded
    (map-set pools pool-id
      (merge pool { is-refunded: true })
    )

    (ok true)
  )
)

;; Cancel pool (creator only, before any contributions)
(define-public (cancel-pool (pool-id uint))
  (let
    (
      (pool (unwrap! (map-get? pools pool-id) ERR_POOL_NOT_FOUND))
    )
    ;; Only creator can cancel
    (asserts! (is-eq tx-sender (get creator pool)) ERR_NOT_AUTHORIZED)

    ;; No contributions must exist
    (asserts! (is-eq (get contributor-count pool) u0) ERR_POOL_HAS_CONTRIBUTIONS)

    ;; Must not already be complete or refunded
    (asserts! (not (get is-complete pool)) ERR_POOL_ALREADY_COMPLETE)
    (asserts! (not (get is-refunded pool)) ERR_POOL_ALREADY_REFUNDED)

    ;; Mark as refunded (effectively cancelled)
    (map-set pools pool-id
      (merge pool { is-refunded: true })
    )

    (ok true)
  )
)
