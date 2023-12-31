import { Request, Response } from 'express';
import { 
    AircraftType,
    Aircraft,
    Photo,
    Airline
 } from '../db';
import { v4 as uuidv4 } from "uuid"
import { 
    getAircraftData, 
    createAircraft,
    createAircraftType
} from "../controller/aircraftController"


// AIRCRAFT TYPE CONTROLLERS 

const getAircraftType = async (req: Request, res: Response) => {
    const manufacturer: string = req.params.manufacturer;
    const queryModel: string = req.params.model;
    try {
        const aircraftDb = await AircraftType.findOne({ 
            where: { model: queryModel.toUpperCase() } 
        });        
        if(aircraftDb){
            res.status(200).json(aircraftDb)
        }else{            
            let responseData = await getAircraftData(manufacturer, queryModel)       
            res.status(200).json(responseData);
        }
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

const postAircraftType = async (req: Request, res: Response) => {
    try {
        const manufacturer: string = req.params.manufacturer;
        const queryModel: string = req.params.model;
        const {
            max_speed_knots,
            ceiling_ft,
            gross_weight_lbs,
            length_ft, 
            height_ft,
            wing_span_ft,
            range_nautical_miles,
        } = req.body
        const id = uuidv4()
        const response = await createAircraftType(
            id,
            manufacturer,
            queryModel,
            max_speed_knots,
            ceiling_ft,
            gross_weight_lbs,
            length_ft, 
            height_ft,
            wing_span_ft,
            range_nautical_miles,
        )
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

// AIRCRAFT CONTROLLERS 

const postAircraft = async (req: Request, res: Response) => {
    try {
        const {
            registration,
            special_livery,
            type,
            aircraft_description,
            aircraft_type,
            airline
        } = req.body
        const id = uuidv4()
        const responseData = await createAircraft(
                id,
                registration,
                special_livery,
                type,
                aircraft_description,
                aircraft_type,
                airline
            )
        res.status(200).json(responseData);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

const getAllAircraftTypes = async (req: Request, res: Response) => {
    try {
        const response = await AircraftType.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
} 

const getAllAircrafts = async (req: Request, res: Response) => {
    try {
        const response = await Aircraft.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

const getAircraftById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id        
        const aircraftById = await Aircraft.findByPk(id, {
            include: [
                {
                    model: Photo
                },
                {
                    model: AircraftType,
                    attributes: ['id', 'model', 'manufacturer']
                },
                {
                    model: Airline,
                    attributes: ['id', 'name', 'iata_code']
                }
                ]
        })
        if(aircraftById){
            res.status(200).json(aircraftById);
        }else{
            throw new Error(`aircraft with id ${id} not found`)
        }
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}



module.exports = { 
    getAircraftType,
    postAircraft,
    postAircraftType,
    getAllAircraftTypes,
    getAllAircrafts,
    getAircraftById
}