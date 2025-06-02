import { IsNotEmpty, Max, Min } from "class-validator";

export class EditStartBillingDateDto {
    @IsNotEmpty()
    @Min(1, { message: 'Billing cycle start day must be at least 1' })
    @Max(28, { message: 'Billing cycle start day must not exceed 28' })
    billingCycleStartDay!: number;
}