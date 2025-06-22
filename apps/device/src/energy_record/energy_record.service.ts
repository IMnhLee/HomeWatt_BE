import { Injectable, Logger } from "@nestjs/common";
import { EnergyRecordRepository } from "./energy_record.repository";
import { MonitoringRepository } from "../monitoring/monitoring.repository";
import { SettingRepository } from "../setting/setting.repository";
import { RedisService } from "./redis/redis.service";
import { PriceType } from "../entities/setting.entity";
import { Repository, In, MoreThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OnePriceConfig } from "../entities/one-price-config.entity";
import { PercentPriceConfig } from "../entities/percent-price-config.entity";
import { StairPriceConfig } from "../entities/stair-price-config.entity";
import * as moment from 'moment';

interface ChartDataPoint {
  label: string;
  timestamp: number; // Unix timestamp for sorting and chart purposes
  data: { [lineCode: string]: number };
  costs: { [lineCode: string]: number };
  totalEnergy: number;
  totalCost: number;
}

interface ConsumptionResult {
  totalEnergy: number;
  totalCost: number;
  currentPrice: number;
  chartData: ChartDataPoint[];
  lineNames: { [lineCode: string]: string };
  lineCosts: { [lineCode: string]: number };
  lineEnergy: { [lineCode: string]: number };
  displayByHour: boolean; // Added to indicate display mode
}

@Injectable()
export class EnergyRecordService {
    private readonly logger = new Logger(EnergyRecordService.name);
    constructor(
        private readonly energyRecordRepository: EnergyRecordRepository,
        private readonly monitoringRepository: MonitoringRepository,
        private readonly settingRepository: SettingRepository,
        private readonly redisService: RedisService,
        @InjectRepository(OnePriceConfig)
        private readonly onePriceConfigRepository: Repository<OnePriceConfig>,
        @InjectRepository(PercentPriceConfig)
        private readonly percentPriceConfigRepository: Repository<PercentPriceConfig>,
        @InjectRepository(StairPriceConfig)
        private readonly stairPriceConfigRepository: Repository<StairPriceConfig>
    ) {}

    async getEnergyConsumptionAndCost(userId: string): Promise<ConsumptionResult> {
        // Get user settings
        const setting = await this.settingRepository.findOneBy({ where: { userId } });

        // Calculate billing cycle start date with GMT+7 timezone
        const today = moment().utcOffset('+07:00');
        const currentMonth = today.month();
        const currentYear = today.year();
        const currentDay = today.date();
        
        let billingStartDate = moment()
            .year(currentYear)
            .month(currentMonth)
            .date(setting.billingCycleStartDay)
            .hour(0)
            .minute(0)
            .second(0)
        
        // If today is before the billing start day of the current month,
        // we need to use the billing start day from the previous month
        if (currentDay < setting.billingCycleStartDay) {
            billingStartDate = billingStartDate.subtract(1, 'month');
        }

        // Get all active lines for the user
        const monitorings = await this.monitoringRepository.findLinesByUserId(userId);
        const activeLines = monitorings
            .flatMap(m => m.lines)
            .filter(line => line.active);
        
        if (activeLines.length === 0) {
            return {
                totalEnergy: 0,
                totalCost: 0,
                currentPrice: 0,
                chartData: [],
                lineNames: {},
                lineCosts: {},
                lineEnergy: {},
                displayByHour: false
            };
        }

        // Get line codes and create a mapping for line names
        const lineCodes = activeLines.map(line => line.code);
        const lineNames: { [key: string]: string } = {};
        activeLines.forEach(line => {
            lineNames[line.code] = line.name || line.code;
        });

        // Get energy records for the billing period
        // Convert to database format (YYYY-MM-DD HH:mm:ss) without timezone adjustment
        const billingStartDateForQuery = new Date(billingStartDate.format('YYYY-MM-DD HH:mm:ss'));
        const todayForQuery = new Date(today.format('YYYY-MM-DD HH:mm:ss'));

        console.log("Billing Start Date:", billingStartDateForQuery, "Today:", todayForQuery);
        const energyRecords = await this.energyRecordRepository.findWithOptions({
            where: {
                lineCode: In(lineCodes),
                date: Between(billingStartDateForQuery, todayForQuery)
            }
        });

        // Calculate total energy consumption and energy per line
        const lineEnergy: { [lineCode: string]: number } = {};
        lineCodes.forEach(code => lineEnergy[code] = 0);
        
        energyRecords.forEach(record => {
            lineEnergy[record.lineCode] = (lineEnergy[record.lineCode] || 0) + Number(record.energy);
        });
        
        const totalEnergy = Object.values(lineEnergy).reduce((sum, energy) => sum + energy, 0);

        // Calculate costs based on pricing type
        let currentPrice = 0;
        let totalCost = 0;
        const lineCosts: { [lineCode: string]: number } = {};

        switch (setting.priceType) {
            case PriceType.ONE_PRICE:
                const onePrice = await this.onePriceConfigRepository.findOne({
                    where: { userId }
                });
                currentPrice = onePrice ? Number(onePrice.price) : 0;
                
                // Calculate cost for each line
                Object.keys(lineEnergy).forEach(lineCode => {
                    lineCosts[lineCode] = lineEnergy[lineCode] * currentPrice;
                });
                
                totalCost = totalEnergy * currentPrice;
                break;

            case PriceType.PERCENT_PRICE:
                const percentPrices = await this.percentPriceConfigRepository.find({
                    where: { userId }
                });
                
                for (const config of percentPrices) {
                    currentPrice += Number(config.price) * (Number(config.percent) / 100);
                } 
                
                // Calculate cost for each line
                Object.keys(lineEnergy).forEach(lineCode => {
                    lineCosts[lineCode] = lineEnergy[lineCode] * currentPrice;
                });
                
                totalCost = totalEnergy * currentPrice;
                break;

            case PriceType.STAIR_PRICE:
                const stairPrices = await this.stairPriceConfigRepository.find({
                    where: { userId },
                    order: { step: 'ASC' }
                });
                
                if (stairPrices.length === 0) {
                    break;
                }
                
                // Calculate total cost with stair pricing
                let remainingEnergy = totalEnergy;
                totalCost = 0;
                let costByStair: { step: number; energy: number; price: number; cost: number }[] = [];
                
                for (const stair of stairPrices) {
                    const minKwh = Number(stair.minKwh);
                    const maxKwh = stair.maxKwh ? Number(stair.maxKwh) : Infinity;
                    const stairPrice = Number(stair.price);
                    
                    const stairRange = maxKwh - minKwh;
                    const energyInStair = Math.min(remainingEnergy, stairRange);
                    
                    if (energyInStair > 0) {
                        const stairCost = energyInStair * stairPrice;
                        totalCost += stairCost;
                        costByStair.push({ 
                            step: stair.step, 
                            energy: energyInStair, 
                            price: stairPrice,
                            cost: stairCost
                        });
                        remainingEnergy -= energyInStair;
                    }
                    
                    // Use the highest stair price for current price display
                    if (remainingEnergy <= 0) {
                        currentPrice = stairPrice;
                        break;
                    }
                }
                
                // Calculate line costs proportionally to their energy consumption
                Object.keys(lineEnergy).forEach(lineCode => {
                    if (totalEnergy === 0) {
                        lineCosts[lineCode] = 0;
                        return;
                    }
                    
                    const lineEnergyValue = lineEnergy[lineCode];
                    let lineCost = 0;
                    let lineRemainingEnergy = lineEnergyValue;
                    
                    // Distribute the line's energy across stair price tiers proportionally
                    for (const stair of costByStair) {
                        // Calculate what proportion of this stair's energy belongs to this line
                        const linePortionOfStair = Math.min(
                            lineRemainingEnergy,
                            (lineEnergyValue / totalEnergy) * stair.energy
                        );
                        
                        if (linePortionOfStair > 0) {
                            lineCost += linePortionOfStair * stair.price;
                            lineRemainingEnergy -= linePortionOfStair;
                        }
                        
                        if (lineRemainingEnergy <= 0) {
                            break;
                        }
                    }
                    
                    lineCosts[lineCode] = lineCost;
                });
                break;
        }

        // Prepare chart data
        const diffInHours = Math.abs(billingStartDate.diff(today, 'hours'));
        const displayByHour = diffInHours <= 24;
        
        // Generate time slots from actual record dates instead of creating all possible slots
        const uniqueTimeGroups = new Set<string>();
        const groupByFormat = displayByHour ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD';
        
        energyRecords.forEach(record => {
            const recordMoment = moment(record.date);
            const timeGroup = recordMoment.format(groupByFormat);
            uniqueTimeGroups.add(timeGroup);
        });
        
        // Convert to sorted array and create time slots
        const sortedTimeGroups = Array.from(uniqueTimeGroups).sort();
        const timeSlots: { key: string, group: string, timestamp: number }[] = sortedTimeGroups.map(group => {
            let key: string;
            let timestamp: number;
            
            if (displayByHour) {
                // Convert from "YYYY-MM-DD HH" to "YYYY-MM-DDTHH:00:00"
                const [datePart, hourPart] = group.split(' ');
                key = `${datePart}T${hourPart.padStart(2, '0')}:00:00`;
                const momentTime = moment(`${datePart} ${hourPart}:00:00`, 'YYYY-MM-DD HH:mm:ss');
                timestamp = momentTime.valueOf();
            } else {
                key = group; // group is already in YYYY-MM-DD format
                const momentTime = moment(group, 'YYYY-MM-DD');
                timestamp = momentTime.valueOf();
            }
            
            return {
                key,
                group,
                timestamp
            };
        });
        
        // If no records found, return empty result
        if (timeSlots.length === 0) {
            return {
                totalEnergy,
                totalCost,
                currentPrice,
                chartData: [],
                lineNames,
                lineCosts,
                lineEnergy,
                displayByHour
            };
        }
        
        // Initialize data structure
        const recordsByTime: { [timeGroup: string]: { [lineCode: string]: number } } = {};
        timeSlots.forEach(slot => {
            recordsByTime[slot.group] = {};
            lineCodes.forEach(code => {
                recordsByTime[slot.group][code] = 0;
            });
        });
        
        // Fill in actual energy data
        energyRecords.forEach(record => {
            const recordMoment = moment(record.date);
            const timeGroup = recordMoment.format(groupByFormat);
            
            if (recordsByTime[timeGroup]) {
                recordsByTime[timeGroup][record.lineCode] = 
                    (recordsByTime[timeGroup][record.lineCode] || 0) + Number(record.energy);
            }
        });
        
        // Create chart data points with costs for each time slot
        const chartData: ChartDataPoint[] = timeSlots.map(slot => {
            const timePointData = recordsByTime[slot.group];
            const totalEnergyForTimePoint = Object.values(timePointData)
                .reduce((sum, energy) => sum + Number(energy), 0);
                
            // Calculate costs for this time point
            const timePointCosts: { [lineCode: string]: number } = {};
            let totalCostForTimePoint = 0;
            
            // Calculate costs based on energy consumption ratio
            Object.keys(timePointData).forEach(lineCode => {
                if (lineEnergy[lineCode] === 0) {
                    timePointCosts[lineCode] = 0;
                    return;
                }
                
                // Calculate cost proportionally to the energy consumption at this time point
                const ratio = timePointData[lineCode] / lineEnergy[lineCode];
                timePointCosts[lineCode] = lineCosts[lineCode] * ratio;
                totalCostForTimePoint += timePointCosts[lineCode];
            });
                
            return {
                label: slot.key,
                timestamp: slot.timestamp,
                data: timePointData,
                costs: timePointCosts,
                totalEnergy: totalEnergyForTimePoint,
                totalCost: totalCostForTimePoint
            };
        });

        return {
            totalEnergy,
            totalCost,
            currentPrice,
            chartData,
            lineNames,
            lineCosts,
            lineEnergy,
            displayByHour
        };
    }
}