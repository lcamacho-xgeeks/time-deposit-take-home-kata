import type { TimeDeposit } from "../../entities/TimeDeposit"

export interface InterestCalculator {
    calculateInterests(deposit: TimeDeposit): number
    planType: string
}
