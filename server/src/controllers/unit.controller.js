import { errorResponse, successResponse } from "../utils/response.js";
import ApiError from "../errors/ApiError.js";
import {
    getAllUnitsService,
    getUnitByIdService,
    createUnitService,
    updateUnitService,
    deleteUnitService
} from "../services/unit.service.js";
import {
    createUnitSchema,
    updateUnitSchema
} from "../validations/unit.validation.js";

export const getAllUnits = async (
    req,
    res,
    next 
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const result = await getAllUnitsService({
            page,
            limit,
            search 
        });

        return successResponse(
            res,
            "Units retrieved successfully",
            result 
        );
    } catch (error) {
        next(error);
    }
};

export const getUnitById = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid unit ID",
                400
            );
        }

        const unit = await getUnitByIdService(
            id 
        );

        return successResponse(
            res,
            "Unit retrieved successfully",
            unit 
        );
    } catch (error) {
        next(error); 
    }
};

export const createUnit = async (
    req,
    res,
    next 
) => {
    try {
        const payload = createUnitSchema.parse(
            req.body 
        );

        const unit = await createUnitService(
            payload 
        );

        return successResponse(
            res,
            "Unit created successfully",
            unit,
            201 
        );
    } catch (error) {
        next(error);
    }
};

export const updateUnit = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid unit ID",
                400 
            );
        }

        const payload = await updateUnitSchema.parse(
            req.body 
        );

        const unit = await updateUnitService(
            id,
            payload 
        );

        return successResponse(
            res,
            "Unit updated successfully",
            unit 
        );
    } catch (error) {
        next(error);
    }
};

export const deleteUnit = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid unit ID",
                400 
            );
        }

        await deleteUnitService(id);

        return successResponse(
            res,
            "Unit deleted successfully" 
        );
    } catch (error) {
        next(error);
    }
};