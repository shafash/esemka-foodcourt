import { errorResponse, successResponse } from "../utils/response.js";
import ApiError from "../errors/ApiError.js";
import {
    getAllTablesService,
    getTableByIdService,
    createTableService,
    updateTableService,
    deleteTableService
} from "../services/table.service.js";
import {
    createTableSchema,
    updateTableSchema
} from "../validations/table.validation.js";

export const getAllTables = async (
    req,
    res,
    next
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const result = await getAllTablesService({
            page,
            limit,
            search
        });

        return successResponse(
            res,
            "Tables retrieved successfully",
            result
        );
    } catch (error) {
        next(error);
    }
};

export const getTableById = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid table ID",
                400
            );
        }

        const table = await getTableByIdService(id);

        return successResponse(
            res,
            "Table retrieved successfully",
            table
        );
    } catch (error) {
        next(error);
    }
};

export const createTable = async (
    req,
    res,
    next
) => {
    try {
        const payload = createTableSchema.parse(
            req.body
        );

        const table = await createTableService(
            payload
        );

        return successResponse(
            res,
            "Table created successfully",
            table,
            201
        );
    } catch (error) {
        next(error);
    }
};

export const updateTable = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid table ID",
                400
            );
        }

        const payload = updateTableSchema.parse(
            req.body
        );

        const table = await updateTableService(
            id,
            payload
        );

        return successResponse(
            res,
            "Table updated successfully",
            table
        );
    } catch (error) {
        next(error);
    }
};

export const deleteTable = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid table ID",
                400
            );
        }

        await deleteTableService(id);

        return successResponse(
            res,
            "Table deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};