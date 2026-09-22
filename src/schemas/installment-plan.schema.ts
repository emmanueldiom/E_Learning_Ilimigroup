import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class Installment {
	@Prop({ type: Number, required: true, min: 1 })
	number!: number;

	@Prop({ type: Number, required: true, min: 0 })
	amount!: number;

	@Prop({ type: Date, required: true })
	dueAt!: Date;

	@Prop({ type: Types.ObjectId, ref: 'SecurityCode', default: null })
	securityCodeId!: Types.ObjectId | null;

	@Prop({ type: Date, default: null })
	validatedAt!: Date | null;
}

export type InstallmentPlanDocument = HydratedDocument<InstallmentPlan>;

@Schema({ timestamps: true })
export class InstallmentPlan {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	studentId!: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: 'Formation', required: true })
	formationId!: Types.ObjectId;

	@Prop({ type: Number, required: true, min: 1 })
	chosenInstallments!: number;

	@Prop({ type: [Installment], required: true, default: [] })
	installments!: Installment[];
}

export const InstallmentPlanSchema = SchemaFactory.createForClass(InstallmentPlan);
InstallmentPlanSchema.index({ studentId: 1, formationId: 1 }, { unique: true });