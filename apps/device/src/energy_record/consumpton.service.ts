import { Injectable, Logger } from "@nestjs/common";
import { EnergyRecordRepository } from "./energy_record.repository";
import { MonitoringRepository } from "../monitoring/monitoring.repository";
import { In, Between } from "typeorm";
import * as moment from 'moment';

interface EnergyConsumptionData {
  timeLabels: string[];
  lines: {
    lineCode: string;
    lineName: string;
    roomId?: string;
    roomName?: string;
    floorId?: string;
    floorName?: string;
    data: number[];
  }[];
  totalsByTime: number[];
}

@Injectable()
export class ConsumptionService {
    private readonly logger = new Logger(ConsumptionService.name);
    
    constructor(
        private readonly energyRecordRepository: EnergyRecordRepository,
        private readonly monitoringRepository: MonitoringRepository,
    ) {}

    async getEnergyConsumption(
        userId: string,
        date: string,
        viewType: 'daily' | 'monthly'
    ): Promise<EnergyConsumptionData> {
        // Parse the input date
        const targetDate = moment(date).utcOffset('+07:00');
        
        // Define start and end dates based on view type
        let startDate: moment.Moment;
        let endDate: moment.Moment;
        let timeFormat: string;
        let groupByFormat: string;
        
        if (viewType === 'monthly') {
            // For monthly view, get the whole month
            startDate = moment(targetDate).startOf('month');
            endDate = moment(targetDate).endOf('month');
            timeFormat = 'YYYY-MM-DD';
            groupByFormat = 'YYYY-MM-DD';
        } else {
            // For daily view, get the whole day
            startDate = moment(targetDate).startOf('day');
            endDate = moment(targetDate).endOf('day');
            timeFormat = 'YYYY-MM-DDTHH:00:00'; // Include full ISO date format with hour
            groupByFormat = 'YYYY-MM-DD HH';
        }
        
        // Adjust for timezone in database queries
        const startDateForQuery = startDate.clone().subtract(7, 'hours').toDate();
        const endDateForQuery = endDate.clone().subtract(7, 'hours').toDate();
        
        // Get all active lines for the user with room and floor relations
        const monitorings = await this.monitoringRepository.findByUserIdWithRelations(userId);
        const activeLines = monitorings
            .flatMap(m => m.lines)
            .filter(line => line.active);
            
        if (activeLines.length === 0) {
            return {
                timeLabels: [],
                lines: [],
                totalsByTime: []
            };
        }
        
        // Get line codes and create a mapping for line details including room and floor
        const lineCodes = activeLines.map(line => line.code);
        const lineDetails: { 
            [key: string]: { 
                name: string, 
                roomId?: string,
                roomName?: string,
                floorId?: string,
                floorName?: string
            }
        } = {};
        
        activeLines.forEach(line => {
            lineDetails[line.code] = {
                name: line.name || line.code,
                roomId: line.room?.id,
                roomName: line.room?.name,
                floorId: line.room?.floor?.id,
                floorName: line.room?.floor?.name
            };
        });
        
        // Get energy records for the specified time period
        const energyRecords = await this.energyRecordRepository.findWithOptions({
            where: {
                lineCode: In(lineCodes),
                date: Between(startDateForQuery, endDateForQuery)
            }
        });
        
        // Generate all time slots within the range
        const timeSlots: { key: string, group: string }[] = [];
        let currentSlot = startDate.clone();
        
        if (viewType === 'monthly') {
            // Generate all days in the month
            while (currentSlot.isSameOrBefore(endDate)) {
                timeSlots.push({
                    key: currentSlot.format(timeFormat),
                    group: currentSlot.format(groupByFormat)
                });
                currentSlot.add(1, 'day');
            }
        } else {
            // Generate all hours in the day
            while (currentSlot.isSameOrBefore(endDate)) {
                timeSlots.push({
                    key: currentSlot.format(timeFormat),
                    group: currentSlot.format(groupByFormat)
                });
                currentSlot.add(1, 'hour');
            }
        }
        
        // Initialize data structure
        const energyByTime: { [timeGroup: string]: { [lineCode: string]: number } } = {};
        timeSlots.forEach(slot => {
            energyByTime[slot.group] = {};
            lineCodes.forEach(code => {
                energyByTime[slot.group][code] = 0;
            });
        });
        
        // Fill in actual energy data
        energyRecords.forEach(record => {
            const recordMoment = moment(record.date).utcOffset('+07:00');
            const timeGroup = recordMoment.format(groupByFormat);
            
            if (energyByTime[timeGroup]) {
                energyByTime[timeGroup][record.lineCode] = 
                    (energyByTime[timeGroup][record.lineCode] || 0) + Number(record.energy);
            }
        });
        
        // Prepare response data
        const timeLabels = timeSlots.map(slot => slot.key);
        const lineData = lineCodes.map(lineCode => {
            const data = timeSlots.map(slot => 
                energyByTime[slot.group][lineCode] || 0
            );
            
            const details = lineDetails[lineCode];
            
            return {
                lineCode,
                lineName: details.name,
                roomId: details.roomId,
                roomName: details.roomName,
                floorId: details.floorId,
                floorName: details.floorName,
                data
            };
        });
        
        // Calculate totals for each time slot
        const totalsByTime = timeSlots.map(slot => {
            return Object.values(energyByTime[slot.group])
                .reduce((sum, energy) => sum + energy, 0);
        });
        
        return {
            timeLabels,
            lines: lineData,
            totalsByTime
        };
    }
}