import { TimeDeposit } from "../TimeDeposit";

export interface InterestCalculator {
    calculateInterests(deposit: TimeDeposit): number
    planType: string
}
