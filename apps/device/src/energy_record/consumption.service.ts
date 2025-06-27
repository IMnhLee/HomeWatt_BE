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

interface LineCurrentEnergyData {
    lineCode: string;
    lineName: string;
    roomId?: string;
    roomName?: string;
    floorId?: string;
    floorName?: string;
    voltage: number | undefined; // U (V)
    current: number | undefined; // I (A)
    power: number | undefined;   // P (W)
    energy: number | undefined;  // E (kWh)
    recordTime: string;     // Thời gian record (ISO string)
    isCurrentHour: boolean; // Dữ liệu có phải là của giờ hiện tại không
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
        const targetDate = moment(date).subtract(7, 'hours').utcOffset('+07:00');
        // Define start and end dates based on view type
        let startDate: moment.Moment;
        let endDate: moment.Moment;
        let timeFormat: string;
        let groupByFormat: string;
        
        if (viewType === 'monthly') {
            // For monthly view, get the whole month
            startDate = moment(targetDate).startOf('month');
            // For monthly view, set end date to today if it's the current month
            // otherwise set it to the end of the month
            endDate = moment().utcOffset('+07:00').isSame(targetDate, 'month') 
                ? moment().utcOffset('+07:00')
                : moment(targetDate).endOf('month').subtract(1, 'day')
            timeFormat = 'YYYY-MM-DD';
            groupByFormat = 'YYYY-MM-DD';
        } else {
            // For daily view, get the whole day
            startDate = moment(targetDate).startOf('day');
            endDate = moment().utcOffset('+07:00').isSame(targetDate, 'day')
                ? moment().utcOffset('+07:00')
                : moment(targetDate).endOf('day');
            timeFormat = 'YYYY-MM-DDTHH:00:00'; // Include full ISO date format with hour
            groupByFormat = 'YYYY-MM-DD HH';
        }

        // Convert to database format (YYYY-MM-DD HH:mm:ss) without timezone adjustment
        const startDateForQuery = new Date(startDate.format('YYYY-MM-DD HH:mm:ss'));
        const endDateForQuery = new Date(endDate.format('YYYY-MM-DD HH:mm:ss'));
        console.log(startDateForQuery, endDateForQuery)

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

        // Generate time slots from actual record dates instead of creating all possible slots
        const uniqueTimeGroups = new Set<string>();
        
        energyRecords.forEach(record => {
            const recordMoment = moment(record.date);
            const timeGroup = recordMoment.format(groupByFormat);
            uniqueTimeGroups.add(timeGroup);
        });
        
        // Convert to sorted array and create time slots
        const sortedTimeGroups = Array.from(uniqueTimeGroups).sort();
        const timeSlots: { key: string, group: string }[] = sortedTimeGroups.map(group => {
            let key: string;
            if (viewType === 'monthly') {
                key = group; // group is already in YYYY-MM-DD format
            } else {
                // Convert from "YYYY-MM-DD HH" to "YYYY-MM-DDTHH:00:00"
                const [datePart, hourPart] = group.split(' ');
                key = `${datePart}T${hourPart.padStart(2, '0')}:00:00`;
            }
            
            return {
                key,
                group
            };
        });
        
        // If no records found, return empty result
        if (timeSlots.length === 0) {
            return {
                timeLabels: [],
                lines: [],
                totalsByTime: []
            };
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
            const recordMoment = moment(record.date);
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

    async getLineEnergyData(userId: string): Promise<LineCurrentEnergyData[]> { 
        // Get all active lines for the user with room and floor relations
        const monitorings = await this.monitoringRepository.findByUserIdWithRelations(userId);
        const activeLines = monitorings
            .flatMap(m => m.lines)
            .filter(line => line.active);
        
        if (activeLines.length === 0) {
            return [];
        }
        
        // Create a mapping for line details including room and floor
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
        
        const lineCodes = activeLines.map(line => line.code);
        
        // Calculate current hour (round down to hour)
        const now = moment().utcOffset('+07:00');
        const currentHour = now.clone().startOf('hour');
        const currentHourUTC = currentHour.clone().subtract(7, 'hours').toDate();
        
        // Define search range: from current hour to next hour
        const nextHour = currentHour.clone().add(1, 'hour');
        const nextHourUTC = nextHour.clone().subtract(7, 'hours').toDate();
        
        // Get energy records for current hour
        const energyRecords = await this.energyRecordRepository.findWithOptions({
            where: {
                lineCode: In(lineCodes),
                date: Between(currentHourUTC, nextHourUTC)
            }
        });
        
        // Group records by line code and find the best record for each line
        const recordsByLine: { [lineCode: string]: any } = {};
        
        energyRecords.forEach(record => {
            const recordMoment = moment(record.date).utcOffset('+07:00');
            const recordHour = recordMoment.format('YYYY-MM-DD HH');
            const targetHour = currentHour.format('YYYY-MM-DD HH');
            
            // Check if this record is for the current hour
            const isCurrentHourRecord = recordHour === targetHour;
            
            if (!recordsByLine[record.lineCode] || 
                (isCurrentHourRecord && !recordsByLine[record.lineCode].isCurrentHour) ||
                (isCurrentHourRecord === recordsByLine[record.lineCode].isCurrentHour && 
                 Math.abs(recordMoment.diff(currentHour)) < Math.abs(moment(recordsByLine[record.lineCode].date).utcOffset('+07:00').diff(currentHour)))) {
                
                recordsByLine[record.lineCode] = {
                    ...record,
                    isCurrentHour: isCurrentHourRecord
                };
            }
        });
        
        // If no records found for current hour, try to get the most recent record for each line
        for (const lineCode of lineCodes) {
            if (!recordsByLine[lineCode]) {
                // Get the most recent record before current time
                const recentRecord = await this.energyRecordRepository.findWithOptions({
                    where: {
                        lineCode: lineCode,
                    },
                    order: {
                        date: 'DESC'
                    },
                    take: 1
                });
                
                if (recentRecord && recentRecord.length > 0) {
                    const record = recentRecord[0];
                    const recordMoment = moment(record.date).utcOffset('+07:00');
                    
                    recordsByLine[lineCode] = {
                        ...record,
                        isCurrentHour: recordMoment.isSame(currentHour, 'hour')
                    };
                }
            }
        }
        
        // Prepare response data
        const result: LineCurrentEnergyData[] = lineCodes.map(lineCode => {
            const record = recordsByLine[lineCode];
            const details = lineDetails[lineCode];
            
            if (record) {
                const recordMoment = moment(record.date).utcOffset('+07:00');
                
                return {
                    lineCode,
                    lineName: details.name,
                    roomId: details.roomId,
                    roomName: details.roomName,
                    floorId: details.floorId,
                    floorName: details.floorName,
                    voltage: record.voltage ? Number(record.voltage) : undefined,
                    current: record.current ? Number(record.current) : undefined,
                    power: record.power ? Number(record.power) : undefined,
                    energy: record.energy ? Number(record.energy) : undefined,
                    recordTime: recordMoment.format('YYYY-MM-DDTHH:mm:ss+07:00'),
                    isCurrentHour: record.isCurrentHour || false
                };
            } else {
                // No data available for this line
                return {
                    lineCode,
                    lineName: details.name,
                    roomId: details.roomId,
                    roomName: details.roomName,
                    floorId: details.floorId,
                    floorName: details.floorName,
                    voltage: undefined,
                    current: undefined,
                    power: undefined,
                    energy: undefined,
                    recordTime: currentHour.format('YYYY-MM-DDTHH:mm:ss+07:00'),
                    isCurrentHour: false
                };
            }
        });
        
        this.logger.log(`Retrieved current energy data for ${result.length} lines at ${currentHour.format('YYYY-MM-DD HH:mm:ss')}`);
        
        return result;
    }
}