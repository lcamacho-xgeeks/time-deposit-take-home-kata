import { InterestCalculator } from "./InterestCalculator.interface";

export class PremiumPlanInterestCalculator implements InterestCalculator {
    calculateInterests(deposit: TimeDeposit): number {
        let interest = 0
        if (deposit.days > 45) {
            interest = (deposit.balance * 0.05) / 12
        }
        return Math.round((interest + Number.EPSILON) * 100) / 100
    }
    planType = "premium";
}
