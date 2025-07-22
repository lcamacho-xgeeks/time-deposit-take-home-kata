import { TimeDeposit } from "../../entities/TimeDeposit";
import { InterestCalculator } from "./InterestCalculator.interface";

export class BasicPlanInterestCalculator implements InterestCalculator {
    calculateInterests(deposit: TimeDeposit): number {
        let interest = 0
        if (deposit.days > 30) {
            interest = (deposit.balance * 0.01) / 12
        }
        return Math.round((interest + Number.EPSILON) * 100) / 100
    }
    planType =  "basic";
}
