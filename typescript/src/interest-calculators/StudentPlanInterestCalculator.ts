import { TimeDeposit } from "../TimeDeposit";
import { InterestCalculator } from "./InterestCalculator";

export class StudentPlanInterestCalculator implements InterestCalculator {
    calculateInterests(deposit: TimeDeposit): number {
        let interest = 0
        if (deposit.days > 30 && deposit.days < 366) {
            interest = (deposit.balance * 0.03) / 12
        }
        return Math.round((interest + Number.EPSILON) * 100) / 100
    }
    planType = "student";
}
