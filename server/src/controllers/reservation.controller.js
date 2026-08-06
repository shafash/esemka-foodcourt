import { errorResponse, successResponse } from "../utils/response.js";
import ApiError from "../errors/ApiError.js";
import {
    getAllReservationsService,
    getReservationByIdService,
    getMyReservationByIdService,
    createReservationService,
    updateReservationService,
    deleteReservationService,
    cancelReservationService
} from "../services/reservation.service.js";
import {
    updateReservationSchema,
    createReservationSchema
} from "../validations/reservation.validation.js";

export const getAllReservations = async (
    req,
    res,
    next 
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const result  = await getAllReservationsService({
            page,
            limit,
            search 
        });

        return successResponse(
            res,
            "Reservation retrieved successfully",
            result 
        );
    } catch (error) {
        next(error);
    }
};

export const getReservationById = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid reservation ID",
                400
            );
        }

        const reservation = await getReservationByIdService(
            id
        );

        return successResponse(
            res,
            "Reservation retrieved successfully",
            reservation
        );
    } catch (error) {
        next(error);
    }
};

export const updateReservation = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid reservation ID",
                400
            );
        }

        const payload = updateReservationSchema.parse(
            req.body
        );

        const reservation = await updateReservationService(
            id,
            payload
        );

        return successResponse(
            res,
            "Reservation updated successfully",
            reservation
        );
    } catch (error) {
        next(error);
    }
};

export const deleteReservation = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid reservation ID",
                400
            );
        }

        await deleteReservationService(id);

        return successResponse(
            res,
            "Reservation deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};

export const createReservation = async (
    req,
    res,
    next
) => {
    try {
        const payload = createReservationSchema.parse(
            req.body
        );

        const userId = req.user.ID;

        const reservation = await createReservationService(
            userId,
            payload
        );

        return successResponse(
            res,
            "Reservation created successfully",
            reservation,
            201
        );
    } catch (error) {
        next(error);
    }
};

export const getMyReservations = async (
    req,
    res,
    next
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";

        const result = await getMyReservationsService({
            userId: req.user.ID,
            page,
            limit,
            search
        });

        return successResponse(
            res,
            "Reservations retrieved successfully",
            result
        );
    } catch (error) {
        next(error);
    }
};

export const getMyReservationById = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid reservation ID",
                400
            );
        }

        const reservation =
            await getMyReservationByIdService(
                req.user.ID,
                id
            );

        return successResponse(
            res,
            "Reservation retrieved successfully",
            reservation
        );
    } catch (error) {
        next(error);
    }
};

export const cancelReservation = async (
    req,
    res,
    next
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid reservation ID",
                400
            );
        }

        const reservation = await cancelReservationService(
            req.user.ID,
            id
        );

        return successResponse(
            res,
            "Reservation cancelled successfully",
            reservation
        );
    } catch (error) {
        next(error);
    }
};